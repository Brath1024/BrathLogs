---
date: 2023-04-27 17:20:46

title: 【JVM】极致低延迟收集器ZGC探索——亚毫秒级，常数级暂停O(1)原理
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)
## 【JVM】极致低延迟收集器ZGC探索——亚毫秒级，常数级暂停O(1)原理
<div id="content_views" class="markdown_views prism-atom-one-dark"> 
 <svg xmlns="http://www.w3.org/2000/svg" style="display: none;"> <path stroke-linecap="round" d="M5,0 0,2.5 5,5z" id="raphael-marker-block" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></path> 
 </svg> 
 <p></p> 
 <div class="toc"> 
  <h3>文章目录</h3> 
  <ul>
   <li><a href="#ZGC__1">ZGC 收集器</a></li>
   <li>
    <ul>
     <li><a href="#ZGC_21">ZGC历程</a></li>
     <li><a href="#ZGC__53">ZGC 特性</a></li>
     <li>
      <ul>
       <li><a href="#_63">基于区块的内存模型</a></li>
      </ul> </li>
     <li><a href="#_80">完全并发原理</a></li>
     <li>
      <ul>
       <li><a href="#G1_82">G1的回收时停顿</a></li>
       <li><a href="#ZGC_100">ZGC的标记—复制算法</a></li>
       <li><a href="#ZGC_132">ZGC对象定位</a></li>
       <li>
        <ul>
         <li><a href="#_Color_Pointer_135">着色指针 `Color Pointer`</a></li>
         <li><a href="#_View_181">内存视图 `View`</a></li>
         <li><a href="#_Load_Barrier_202">读屏障 `Load Barrier`</a></li>
         <li><a href="#_Forwarding_Table_222">转移表 `Forwarding Table`</a></li>
         <li><a href="#_227">并发标记过程</a></li>
        </ul> </li>
       <li><a href="#_Stack_Watermark_Barrier_243">栈水印屏障 `Stack Watermark Barrier`</a></li>
      </ul> </li>
     <li><a href="#ZGC__275">ZGC 其他特性</a></li>
     <li>
      <ul>
       <li><a href="#_276">支持非统一内存访问架构</a></li>
       <li><a href="#_288">就地重定位</a></li>
      </ul> </li>
     <li><a href="#Azul_Zing_C4_GC_305">对比Azul Zing C4 GC</a></li>
     <li><a href="#_316">总结</a></li>
     <li>
      <ul>
       <li><a href="#ZGC__317">ZGC 优点</a></li>
       <li><a href="#ZGC__326">ZGC 缺点</a></li>
      </ul> </li>
     <li><a href="#ZGC_336">ZGC使用</a></li>
     <li>
      <ul>
       <li><a href="#_337">低版本可用</a></li>
       <li><a href="#ZGC_344">ZGC参数说明</a></li>
       <li><a href="#ZGC_366">ZGC的垃圾回收什么情况下会被触发？</a></li>
      </ul> </li>
     <li><a href="#ZGC_373">ZGC调优</a></li>
    </ul> </li>
   <li><a href="#_398">参考</a></li>
  </ul> 
 </div> 
 <p></p> 
 <h1><a id="ZGC__1"></a>ZGC 收集器</h1> 
 <p>ZGC收集器（Z Garbage Collector）是由Oracle公司为HotSpot JDK研发的，最新一代垃圾收集器。有说法使用这个名目标是取代之前的大部分垃圾收集器，所以才叫ZGC，表示极致的Extremely，或者最后的，垃圾收集器。类似 ZFS（文件系统），ZFS（文件系统）在它刚问世时在许多方面都是革命性的。</p> 
 <p><a href="https://wiki.openjdk.org/display/zgc/Main">ZGC官网</a></p> 
 <blockquote> 
  <p>但是ZGC官方文档说<code>ZGC</code>这只是个名字，不代表任何含义。看你相信哪种了，笑</p> 
 </blockquote> 
 <ul>
  <li>设计目标<br> 希望能在尽可能对吞吐量影响不太大的前提下，实现在任意堆内存大小下都可以把垃圾收集的停顿时间限制在10ms以内的低延迟。 
   <ul>
    <li>停顿时间不超过10ms；</li>
    <li>停顿时间不会随着堆的大小，或者活跃对象的大小而增加；</li>
    <li>支持8MB~4TB级别的堆（未来支持16TB）。</li>
   </ul> </li>
 </ul> 
 <blockquote> 
  <p>主流的常见操作系统，比如Linux,Windows,MacOS,FreeBSD都是非实时操作系统。非实时操作系统的一个处理器时间片都在5~20毫秒，面向服务端的系统一个线程调度事件需要3-5个时间片，客户端系统则更多。10毫秒停顿已经可以认为是系统误差级的停顿，低于 Linux 内核的背景噪声，即调度开销和系统调用开销，此时ZGC基本已经成为无停顿GC。</p> 
 </blockquote> 
 <p>ZGC设计目标停顿时间在10ms以下，10ms其实是一个很保守的数据，在SPECjbb 2015基准测试中，128G的大堆下最大停顿时间才1.68ms，远低于10ms。<br> 而且ZGC目前的进展很快，在JDK17的测试中和shenandoah gc双双实现了亚毫秒(&lt;1ms)的GC暂停。<br> <a href="https://link.zhihu.com/?target=https://developers.redhat.com/articles/2021/09/16/shenandoah-openjdk-17-sub-millisecond-gc-pauses#">Shenandoah in OpenJDK 17: Sub-millisecond GC pauses | Red Hat Developer</a><br> 不负极致之名，Java17之后采用ZGC是最好的选择。</p> 
 <h2><a id="ZGC_21"></a>ZGC历程</h2> 
 <p>在Java11推出实验性的ZGC以来，历经数年开发，ZGC在当前已经新增了众多特性。<br> 一些关于ZGC特性、原理的文章已经稍有过时，比如ZGC只支持4TB大小的堆，ZGC不支持类卸载，ZGC只支持Linux/x64架构等。</p> 
 <p>不过通过这些文章对ZGC进行了解还是可行的。</p> 
 <p>ZGC各版本特性变化</p> 
 <ul>
  <li>JDK 12 
   <ul>
    <li>支持并发类卸载</li>
   </ul> </li>
  <li>JDK 13 
   <ul>
    <li>支持最大堆从4TB提升到16TB</li>
    <li>支持Linux/AArch64架构</li>
    <li>支持归还未使用内存</li>
   </ul> </li>
  <li>JDK 14 
   <ul>
    <li>支持MacOS/x64、Windows/x64架构</li>
    <li>支持最低8M的小堆</li>
   </ul> </li>
  <li>JDK 15 
   <ul>
    <li>生产就绪</li>
    <li>支持类数据共享（CDS）</li>
    <li>支持压缩类指针（对象头）</li>
    <li>支持渐进式归还内存</li>
   </ul> </li>
  <li>JDK 16 
   <ul>
    <li>新增并发线程栈扫描特性</li>
    <li>支持对象就地迁移</li>
    <li>支持Windows/aarch64架构</li>
   </ul> </li>
  <li>JDK 17 
   <ul>
    <li>新增动态GC线程数特性</li>
    <li>新增JVM快速退出特性</li>
    <li>支持macOS/aarch64架构</li>
   </ul> </li>
  <li>JDK 18 
   <ul>
    <li>支持字符串重复数据删除</li>
    <li>支持Linux/PowerPC架构</li>
   </ul> </li>
 </ul> 
 <h2><a id="ZGC__53"></a>ZGC 特性</h2> 
 <ul>
  <li>完全并发</li>
  <li>使用着色指针</li>
  <li>使用读屏障</li>
  <li>基于区块的内存模型</li>
  <li>支持就近分配的NUMA处理器架构</li>
  <li>压缩内存</li>
 </ul> 
 <p>其中完全并发的能力，是通过<strong>着色指针，读屏障，基于区块的内存模型</strong>来实现的，算是ZGC的<strong>基础特性</strong>。后面会首先研究。<br> 支持就近分配的NUMA处理器架构，压缩内存等是性能提升措施，会在完全并发之后介绍。</p> 
 <h3><a id="_63"></a>基于区块的内存模型</h3> 
 <p>类似于G1，ZGC也采用基于区块(<code>Region</code>)的堆内存布局，每个区块被称为<code>ZPage</code>。不同于G1的是，ZGC的区块具有动态性。ZGC的区块，支持动态创建和销毁，支持动态的区域容量大小变化。<br> ZGC区块分为以下几种</p> 
 <ul>
  <li> <p>小型区块（<code>Small Region</code>）：<br> 容量固定为2MB，用于放置小于256KB的小对象。</p> </li>
  <li> <p>中型区块（<code>Medium Region</code>）：<br> 容量固定为32MB，用于放置大于等于256KB但小于4MB的对象。</p> </li>
  <li> <p>大型区块（<code>Large Region</code>）：<br> 容量不固定，可以动态变化，但必须为2MB的整数倍，用于放置4MB或以上的大对象。每个大型Region中只会存放一个大对象，所以实际容量可能小于中型Region，最小容量可低至4MB。大型Region在ZGC的实现中是不会被重分配的，因为复制一个大对象的代价非常高昂。</p> </li>
 </ul> 
 <p><img src="https://img-blog.csdnimg.cn/img_convert/1eaac553ce4d82f137754de097cde9c0.png#pic_center" alt="ZPage"><br> 可以看到相比G1，ZGC的区块动态性不包括堆内存的每个区块可以根据运行情况的需要，扮演年轻代的Eden、Survivor区域、老年代区域、或者大对象(Humongous)区域。这是因为ZGC目前并不支持分代垃圾回收，没错，ZGC这个强大的收集器目前并不支持分代，据说是因为实现分代太复杂了，连Oracle团队也比较棘手。但不代表ZGC就不会用分代模型，已经有让ZGC支持分代回收的提案了<a href="https://openjdk.org/jeps/439">JEP439</a>，就看未来什么时候能实现。</p> 
 <h2><a id="_80"></a>完全并发原理</h2> 
 <p>ZGC的最大特性就是做到了GC过程中的大部分阶段都能和用户线程并发，只有极少阶段（&lt;1ms）需要停顿，那么ZGC是如何做到的呢？</p> 
 <h3><a id="G1_82"></a>G1的回收时停顿</h3> 
 <p>G1和ZGC都基于标记-复制算法，但算法具体实现的不同就导致了巨大的性能差异。</p> 
 <p>以G1为例，通过G1中标记-复制算法过程（G1的Young GC和Mixed GC均采用该算法），分析G1的混合回收中停顿耗时的主要瓶颈。<br> <img src="https://img-blog.csdnimg.cn/b900e50509c24fd892f3b19b8ca29c64.png" alt="G1中标记-复制算法过程"><br> 已知G1混合回收采用了标记—复制的算法，混合回收(MixedGC)过程可以分为标记阶段、筛选回收阶段。其中筛选回收又分为清理阶段和复制阶段。</p> 
 <ul>
  <li>标记阶段停顿分析 耗时较短 
   <ul>
    <li>初始标记阶段：初始标记阶段是指从GC Roots出发标记全部直接子节点的过程，该阶段是STW的。由于GC Roots数量不多，通常该阶段耗时非常短。</li>
    <li>并发标记阶段：并发标记阶段是指从GC Roots开始对堆中对象进行可达性分析，找出存活对象。该阶段是并发的，即应用线程和GC线程可以同时活动。并发标记耗时相对长很多，但因为不是<em>程序停顿</em>，所以我们不太关心该阶段耗时的长短。</li>
    <li>再标记阶段：重新标记那些在并发标记阶段发生变化的对象。该阶段是STW的。</li>
   </ul> </li>
  <li>清理阶段停顿分析 耗时较短<br> 清理阶段识别出有存活对象的分区和没有存活对象的分区，该阶段不会清理垃圾对象，也不会执行存活对象的复制。该阶段是<em>程序停顿</em>的。</li>
  <li>复制阶段停顿分析 <strong>耗时较长</strong><br> 复制算法中的转移阶段需要分配新内存和复制对象的成员变量。转移阶段是<em>程序停顿</em>的，其中内存分配通常耗时非常短，但对象成员变量的复制耗时有可能较长，这是因为复制耗时与存活对象数量与对象复杂度成正比。对象越复杂，复制耗时越长。</li>
 </ul> 
 <p>四个STW过程中，初始标记因为只标记GC Roots，耗时较短。再标记因为对象数少，耗时也较短。清理阶段因为内存分区数量少，耗时也较短。 <strong>复制-转移阶段要处理所有存活的对象，耗时会较长。因此，G1停顿时间的瓶颈主要是标记-复制算法中的复制-转移阶段的<em>程序停顿</em></strong> 。为什么转移阶段不能和标记阶段一样并发执行呢？主要是G1未能解决转移过程中准确定位对象地址的问题。</p> 
 <h3><a id="ZGC_100"></a>ZGC的标记—复制算法</h3> 
 <p>与G1类似，ZGC也采用标记-复制算法，不过ZGC对该算法做了重大改进：ZGC在标记、转移和重定位阶段几乎都是并发的，这是ZGC实现停顿时间小于10ms目标的最关键原因。</p> 
 <p><img src="https://img-blog.csdnimg.cn/4eae71dfced44545b02e6f3768712ee3.png" alt="ZGC的标记—复制算法"><br> ZGC中的一次垃圾回收过程会被分为十个步骤：初始标记、并发标记、再次标记、并发转移准备：[非强引用并发标记、重置转移集、回收无效页面（区）、选择目标回收页面、初始化转移集（表）]、初始转移、并发转移。但是只有三个阶段需要停顿(STW)：<strong>初始标记，再标记，初始转移</strong>。其中，初始标记和初始转移分别都只需要扫描所有GC Roots，其处理时间和GC Roots的数量成正比，一般情况耗时非常短；再标记阶段STW时间很短，最多1ms，超过1ms则再次进入并发标记阶段。即，ZGC几乎所有暂停都只依赖于GC Roots集合大小，停顿时间不会随着堆的大小或者活跃对象的大小而增加。与ZGC对比，G1的转移阶段完全STW的，且停顿时间随存活对象的大小增加而增加。</p> 
 <ul>
  <li>①初始标记<br> 这个阶段会触发STW，仅标记根可直达的对象，并将其压入到标记栈中，在该阶段中也会发生一些其他动作，如重置 TLAB、判断是否要清除软引用等。</li>
  <li>②并发标记<br> 根据「初始标记」的根对象开启多条GC线程，并发遍历对象图，同时也会统计每个分区/页面中的存活对象数量。</li>
  <li>③再次标记<br> 这个阶段也会出现短暂的STW，因为「并发标记」阶段中应用线程还是在运行的，所以会修改对象的引用导致漏标的情况出现，因此需要再次标记阶段来标记漏标的对象（如果此阶段停顿时间过长，ZGC会再次进入并发标记阶段重新标记）。</li>
  <li>并发转移准备<br> 4~8阶段都是并发转移对象的准备阶段，各子阶段又分别处理了不同事务 
   <ul>
    <li>④非强引用并发标记和引用并发处理<br> 遍历前面过程中的非强引用类型根对象，但并不是所有非强根对象都可并发标记，有部分不能并发标记的非强根对象会在前面的「再次标记」阶段中处理。同时也会标记堆中的非强引用类型对象。</li>
    <li>⑤重置转移集/表<br> 重置上一次GC发生时，转移表中记录的数据，方便本次GC使用。<br> 在ZGC中，因为在回收时需要把一个分区中的存活对象转移进另外一个空闲分区中，而ZGC的转移又是并发执行的，因此，一条用户线程访问堆中的一个对象时，该对象恰巧被转移了，那么这条用户线程根据原本的指针是无法定位对象的，所以在ZGC中引入了转移表<code>forwardingTable</code>的概念。<br> 转移表可以理解为一个<code>Map&lt;OldAddress,NewAddress&gt;</code>结构的集合，当一条线程根据指针访问一个被转移的对象时，如果该对象已经被转移，则会根据转移表的记录去新地址中查找对象，并同时会更新指针的引用。</li>
    <li>⑥回收无效分区/页面<br> 回收物理内存已经被释放的无效的虚拟内存页面。ZGC是一款支持返还堆内存给物理机器的收集器，在机器内存紧张时会释放一些未使用的堆空间，但释放的页面需要在新一轮标记完成之后才能释放，所以在这个阶段其实回收的是上一次GC释放的空间。</li>
    <li>⑦选择待回收的分区/页面<br> ZGC与G1收集器一样，也会<strong>存在「垃圾优先」的特性</strong>，在标记完成后，整个堆中会有很多分区可以回收，ZGC也会<strong>筛选出回收价值最大的页面</strong>来作为本次GC回收的目标。</li>
    <li>⑧初始化待转移集合的转移表<br> 初始化待回收分区/页面的转移表，方便记录区中存活对象的转移信息。<br> 注：每个页面/分区都存在一个转移表<code>forwardingTable</code>。</li>
   </ul> </li>
  <li>⑨初始转移<br> 这个阶段会发生STW，遍历所有GCRoots节点及其直连对象，如果遍历到的对象在回收分区集合内，则在新的分区中为该对象分配对应的空间。不过值得注意的是：该阶段只会转移根对象（也就是GCRoots节点直连对象）。</li>
  <li>⑩并发转移<br> 这个阶段与之前的「并发标记」很相似，从上一步转移的根对象出发，遍历目标区域中的所有对象，做并发转移处理。</li>
 </ul> 
 <h3><a id="ZGC_132"></a>ZGC对象定位</h3> 
 <p>ZGC通过着色指针和读屏障技术，解决了转移过程中准确访问对象的问题，实现了并发转移。大致原理描述如下：并发转移中“并发”意味着GC线程在转移对象的过程中，应用线程也在不停地访问对象。假设对象发生转移，但对象地址未及时更新，那么应用线程可能访问到旧地址，从而造成错误。而在ZGC中，应用线程访问对象将触发“读屏障”，如果发现对象被移动了，那么“读屏障”会把读出来的指针更新到对象的新地址上，这样应用线程始终访问的都是对象的新地址。那么，JVM是如何判断对象被移动过呢？就是利用对象引用的地址，即着色指针。</p> 
 <h4><a id="_Color_Pointer_135"></a>着色指针 <code>Color Pointer</code></h4> 
 <p>已知Java虚拟机垃圾回收时的可达性分析使用了标记-整理类算法。从垃圾回收扫描根集合开始标记存活对象，那么这些标记被储存在哪里？</p> 
 <p>HotSpot虚拟机的标记实现方案有如下几种</p> 
 <ul>
  <li>把标记直接记录在对象头上<br> 如Serial收集器</li>
  <li>把标记记录在与对象相互独立的数据结构上<br> 如G1、Shenandoah使用了一种相当于堆内存的1/64大小的，称为BitMap的结构来记录标记信息</li>
  <li>直接把标记信息记在引用对象的指针上<br> 如ZGC</li>
 </ul> 
 <p><strong>为什么可以把引用关系放在指针上？</strong></p> 
 <p>可达性分析算法的标记阶段就是看有没有引用，所以可以只和指针打交道而不管指针所引用的对象本身。<br> 例如使用三色标记法标记对象是否可达，这些标记本质上只和对象引用有关，和对象本身无关。只有对象的引用关系才能决定它的存活。</p> 
 <p><strong>着色指针</strong>是一种直接将少量额外的信息存储在对象指针上的技术。目前在X64架构的操作系统中高16位是不能用来寻址的。程序只能使用低48位，<br> ZGC将低48位中的高4位取出，用来存储4个标志位。剩余的44位可以支持16TB(2的44次幂)的内存，也即ZGC可以管理的内存不超过16TB。<br> 4个标志位即<strong>着色位</strong>，所以这种指针被称为着色指针。<br> <em><strong>在ZGC中标记信息被直接记在引用对象的着色指针上，这样通过对象着色指针就可以获取 GC 标记，解决转移过程中准确定位对象地址的问题。</strong></em></p> 
 <p>因此，ZGC只能在64位系统上，因为ZGC的<strong>着色指针</strong>使用的是44-48位，32位的x86架构系统显然不支持，并且因为ZGC已经把48位可用的指针地址空间全部使用了，自然也不支持压缩指针。<br> <img src="https://img-blog.csdnimg.cn/78024bccd7194d40aa76b6394d1d28f2.png" alt="着色指针"></p> 
 <blockquote> 
  <p>压缩指针和压缩类指针是两个不同的特性，后者又叫压缩对象头，ZGC是支持压缩对象头这一特性的，在JDK15后提供。</p> 
 </blockquote> 
 <p><img src="https://img-blog.csdnimg.cn/img_convert/89112b34a4cff3d0a3350441d17455ef.png#pic_center" alt="着色位"><br> ZGC的四个着色位可以记录四种垃圾回收标记状态，即<code>marked0、marked1、remapped、Finalizable</code>,好像给指针染上了四种不同的颜色，所以叫做着色指针。</p> 
 <blockquote> 
  <ul>
   <li>指针如何实现染色<br> 指针的原本的作用在于寻址，如果我们想实现染色指针，就得把43~46位赋予特殊含义，这样寻址就不对了。所以最简单的方式是寻址之前把指针进行裁剪，只使用低44位去寻址（最大16TB内存）这样做导致的问题是，需要将裁剪指针寻址地址的 CPU 指令添加到生成的代码中，会导致应用程序变慢。<br> 为了解决上面指针裁剪的问题，ZGC 使用了<code>mmap</code>内核函数进行多虚拟地址内存映射。使用 mmap 可以将同一块物理内存映射到多个虚拟地址上。这样，就可以实现堆中的一个对象，有4个虚拟地址，不同的地址标记不同的状态 marked0、marked1、remapped，Finalizable。且都可以访问到内存。这样实现了指针染色的目的，且不用对指针进行裁剪，提高了效率。</li>
  </ul> 
 </blockquote> 
 <p>着色指针的四个着色状态</p> 
 <ul>
  <li>Finalizable=1000 <strong>终结状态</strong><br> 表示对象已经要被回收了，此位与并发引用处理有关，表示这个对象只能通过finalizer才能访问。</li>
  <li>Remapped=0100 <strong>未扫描状态</strong><br> 设置此位的值后，表示这个对象未指向RelocationSet中（relocation set表示需要GC的Region分区/页面集合）。</li>
  <li>Marked1=0010 <strong>已标记状态</strong><br> 对象已标记状态，用于辅助GC。</li>
  <li>Marked0=0001 <strong>已标记状态</strong><br> 对象已标记状态，用于辅助GC。</li>
 </ul> 
 <blockquote> 
  <p>为什么会有两个Marked标识<br> 这是为了防止不同GC周期之间的标记混淆，所以搞了两个Marked标识，每当新的一次GC开始时，都会交换使用的标记位。例如：第一次GC使用M0，第二次GC就会使用M1，第三次又会使用M0…，因为ZGC标记完所有分区的存活对象后，会选择分区进行回收，因此有一部分区域内的存活对象不会被转移，那么这些对象的标识就不会复位，会停留在之前的Marked标识（比如M0），如果下次GC还是使用相同M0来标记对象，那混淆了这两种对象。为了确保标记不会混淆，所以搞了两个Marked标识交替使用。</p> 
 </blockquote> 
 <h4><a id="_View_181"></a>内存视图 <code>View</code></h4> 
 <p>内存视图是指ZGC对Java对象状态的一种描述，<strong>通过内存视图和着色指针配合，ZGC得以完成在并发转移对象的同时准确定位对象地址</strong>。<br> ZGC将所有对象划分为 3 种不同的视图（状态）：<code>marked0、marked1、remapped</code>，同一时刻只能处于其中一种视图（状态）。比如：</p> 
 <ul>
  <li> <p>在没有进行垃圾回收时，视图为<code>remapped</code> 。</p> </li>
  <li> <p>在 GC 进行标记开始，将视图从 <code>remapped </code>切换到<code>marked0/marked1 </code>。</p> </li>
  <li> <p>在 GC 进行转移阶段，又将视图从<code>marked0/marked1 </code>切换到<code>remapped</code>。</p> </li>
  <li> <p>“好”指针和“坏”指针<br> 任意线程当前访问对象的指针的着色状态和当前所处的视图<strong>一致</strong>时，则当前指针为** “好”指针** ；当前指访问对象的指针的状态和当前所处的视图<strong>不一致</strong>时，则为**“坏”指针**。<br> 线程访问到好指针无需处理，直接通过指针访问对象地址。</p> </li>
  <li> <p>触发读屏障<br> 线程访问到坏指针时，在不同阶段会有不同的处理，处理过程在读屏障中实现。</p> 
   <ul>
    <li>标记阶段<br> 访问到坏指针时，说明此对象存活且未被标记，会将指针着色状态调整为已标记的M0/M1状态。</li>
    <li>转移阶段<br> 访问到坏指针时，说明此对象需要被移动。线程会转移对象，然后将指针着色状态调整为未标记的Remapped状态，等待下轮GC扫描。不仅是GC线程，应用线程访问到坏指针时也会转移对象，这称为应用线程的协作转移。这样做让对象转移成为并发的过程，无需等待GC线程转移对象，应用线程自己就可以完成转移。</li>
   </ul> </li>
  <li> <p>着色指针的**“自愈”**<br> 通过上面的说明，发现线程访问到坏指针，在触发读屏障处理后，又恢复成好指针，且直到下轮GC之间无需再处理，线程可以直接访问对象。这一特性被称之为，ZGC的指针拥有“自愈”能力。</p> </li>
 </ul> 
 <h4><a id="_Load_Barrier_202"></a>读屏障 <code>Load Barrier</code></h4> 
 <p>读屏障是一小段在特殊位置由 JIT 注入的代码，类似我们 JAVA 中常用的 AOP 技术；主要目的是处理GC并发转移后地址定位问题，对象漏标问题。</p> 
 <pre><code class="prism language-c">Object o <span class="token operator">=</span> obj<span class="token punctuation">.</span>fieldA<span class="token punctuation">;</span> <span class="token comment">// 只有从堆中获取一个对象时，才会触发读屏障</span>

<span class="token comment">//读屏障伪代码</span>
<span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token punctuation">(</span>o <span class="token operator">&amp;</span> good_bit_mask<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{<!-- --></span>
   <span class="token keyword">if</span> <span class="token punctuation">(</span>o <span class="token operator">!=</span> null<span class="token punctuation">)</span> <span class="token punctuation">{<!-- --></span>
      <span class="token comment">//处理并注册地址</span>
      <span class="token function">slow_path</span><span class="token punctuation">(</span><span class="token function">register_for</span><span class="token punctuation">(</span>o<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token function">address_of</span><span class="token punctuation">(</span>obj<span class="token punctuation">.</span>fieldA<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>       <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
</code></pre> 
 <ul>
  <li> <p>处理对象漏标问题<br> 读屏障是在读取成员变量时，统统记录下来，这种做法是保守的，但也是安全的。根据三色标记法，引发漏标问题必须要满足两个条件，其中条件二为：「已经标为黑色的对象重新与白色对象建立了引用关系」，也就是已经标记过的存活对象（黑色对象）重新和垃圾对象（白色对象）建立了引用关系，而黑色对象想要与白色对象重新建立引用的前提是：得先读取到白色对象，此时读屏障的作用就出来了，可以直接记录谁读取了当前白色对象，然后在「再次标记」重新标记一下这些黑色对象即可。</p> </li>
  <li> <p>处理并发转移时对象地址定位问题<br> GC发生后，堆中一部分存活对象被转移，当应用线程读取对象时，可以利用读屏障通过指针上的标志来判断对象是否被转移，如果读取的对象已经被转移（线程读取到<em>坏指针</em>），那么则修正当前对象引用为最新地址（去转移表中查）。这样做的好处在于：下次其他线程再读取该转移对象时，可以正常访问读取到最新值（着色指针的<em>自愈</em>）。</p> </li>
 </ul> 
 <h4><a id="_Forwarding_Table_222"></a>转移表 <code>Forwarding Table</code></h4> 
 <p>转移表<code>ForwardingTable</code>是ZGC确保转移对象后，其他引用指针能够指向最新地址的一种技术，每个页面/分区(<code>ZPage</code>)中都会存在，其实就是该区中所有存活对象的转移记录，也称之为「活跃信息表」。一条线程通过引用来读取对象时，发现对象被转移后就会去转移表中查询最新的地址，并更新地址。这样在并发场景下，用户线程使用读屏障就可以通过转发表拿到新地址，用户线程可以准确访问并发转移阶段的对象了。<br> 转移表中的数据会在发生下一次GC时清空重置，也包括会在下一次GC时触发着色指针的重映射/重定位操作。在下一次GC并发标记阶段会遍历转发表，完成所有的地址转发过程，最后在并发转移准备阶段会清空转发表。<br> <img src="https://img-blog.csdnimg.cn/456fde95f6e04c63baaebded29f7f39b.png" alt="转移表"></p> 
 <h4><a id="_227"></a>并发标记过程</h4> 
 <p>ZGC基于染色指针的并发处理过程：</p> 
 <ul>
  <li>在第一次GC发生前，堆中所有对象的标识为：Remapped 初始状态。</li>
  <li>第一次GC被触发后，此时内存视图已经为开始GC的M0状态。GC线程开始标记，开始扫描，如果对象是Remapped标志，并且该对象根节点可达的，则将其改为M0标识，表示存活对象且已被标记。</li>
  <li>如果标记过程中，扫描到的对象标识已经为M0，代表该对象已经被标记过，或者是GC开始后新分配的对象，这种情况下无需处理。</li>
  <li>在GC开始后，用户线程新创建的对象，会直接标识为和内存视图一致的M0状态。</li>
  <li>在标记阶段，GC线程仅标记用户线程可直接访问的对象还是不够的，实际上还需要把对象的成员变量所引用的对象都进行递归标记。</li>
 </ul> 
 <p>在「标记阶段」结束后，对象要么是M0存活状态，要么是未被标记的Remapped初始状态，说明这些对象不可达，即待回收状态。最终，所有被标记为M0状态的活跃对象都会被放入「活跃信息表」中。等到了「转移阶段」再对这些对象进行处理，流程如下：</p> 
 <ul>
  <li>ZGC选择目标回收区域，开始并发转移，此时内存视图切换为Remapped状态。</li>
  <li>GC线程遍历访问目标区域中的对象，如果对象标识为M0并且存在于活跃表中，则把该对象转移到新的分区/页面空间中，同时将其标识修正为Remapped标志。</li>
  <li>GC线程如果扫描到的对象存在于活跃表中，但标识为Remapped，说明该对象已经转移过了，无需处理。</li>
  <li>用户线程在「转移阶段」新创建的对象，会被标识为和内存视图一致的Remapped状态。</li>
  <li>如果GC线程遍历到的对象不是M0状态或不在活跃表中，说明不可达，也无需转移处理。<br> 最终，当目标区域中的所有存活对象被转移到新的分区后，ZGC统一回收原本的选择的回收区域。至此，一轮GC结束，整个堆空间会正常执行应用任务，直至触发下一轮GC。而当下一轮GC发生时，会采用M1作为GC辅助标识，而并非M0，具体原因在前面分析过了则不再阐述。</li>
 </ul> 
 <h3><a id="_Stack_Watermark_Barrier_243"></a>栈水印屏障 <code>Stack Watermark Barrier</code></h3> 
 <p>JDK16后通过JEP 376提案合入JDK主线，ZGC的又一强大特性。有了这一特性的支持，从JDK 16开始。ZGC现在的暂停时间为O(1)。换句话说，它们是在恒定的时间内执行的，并且不会随着堆、活动对象集或GC Roots根集大小（或其他任何东西）的增加而增加。通过栈水印屏障特性的支持，ZGC实现了常数级暂停，亚毫秒级暂停的能力。</p> 
 <p>栈水印屏障是什么？先看一下官方博客对此的说明</p> 
 <blockquote> 
  <p>在JDK 16之前，ZGC的暂停时间仍然随GC Roots根集的大小（子集）而缩放。更准确地说，ZGC仍然在停止世界阶段扫描线程栈。这意味着，如果一个Java应用有大量的线程，那么暂停时间会增加。如果这些线程有很深的调用栈，那么暂停时间会增加得更多。从JDK 16开始，线程栈的扫描是并发进行的，即在Java应用程序继续运行的同时进行。<br> 栈水印屏障机制，可以防止Java线程在没有首先检查是否可以安全返回的情况下返回到栈帧。可以把它看作是栈帧的读屏障，如果需要的话，它将迫使Java线程在返回到栈帧之前采取某种形式的动作，使栈帧进入安全状态。每个 Java 线程都有一个或多个栈水印屏障，它告诉屏障在没有任何特殊操作的情况下可以在栈中安全地走多远。要走过一个水印，就要走一条慢路，使一个或多个栈帧进入当前安全状态，并更新水印。将所有线程栈带入安全状态的工作通常由一个或多个GC线程处理，但由于这是并发完成的，如果Java线程返回到GC线程尚未到达的栈帧中，有时就必须修复自己的几个栈帧。<br> 有了JEP 376，ZGC现在在Stop-The-World阶段扫描的根数正好为零。</p> 
 </blockquote> 
 <p>虽然说的有些绕，但还是说明了问题和解决方案。</p> 
 <p>问题就是，在JDK 16之前，<strong>ZGC的暂停时间仍然随GC Roots根集的大小增大而增大</strong>，因为ZGC要在程序完全停顿时，去扫描每个线程的所有栈帧中的回收根GCRoots。因为线程一旦运行，回收根很可能就会变化么，这很好理解。在上面的 【ZGC的标记—复制算法】，这一节里看到在<em>初始标记阶段</em>，应用程序是完全暂停的。<br> 所以随着线程增多等原因，GC Roots根集增大，那自然停顿时间也要增加了呗。解决这个问题的方法，当然是和其他阶段一样，尽量使初始标记阶段对GC根集的扫描也和并发标记阶段一样，可以并发的去标记。</p> 
 <p>ZGC对这个问题怎么处理的？读屏障，没错还是读屏障，这次是对于线程栈帧使用的读屏障。</p> 
 <p>简答来说，就是通过<em><strong>栈水印屏障</strong></em>这一机制，用户线程不会在GC线程正在扫描一个线程栈时，进入这个栈。栈水印屏障的读屏障机制，会确保GC线程正在扫描线程的一个栈帧时，用户线程不会进入到这个栈帧里，直到GC线程标记完成。<strong>这一过程是完全并发的，GC线程在运行时栈的栈顶下方的栈帧里标记，用户线程在运行时栈的栈顶继续执行，栈顶的栈帧由用户线程负责标记。</strong> 这样就可以做到在标记线程栈中的GC根集同时，用户线程并发运行，无需“停止世界”。</p> 
 <p>下面具体研讨下栈水印屏障的组成和原理</p> 
 <ul>
  <li> <p>栈水印是什么？<br> 上面说到了GC线程需要在用户线程运行时并发的去标记GC根节点，那么用户线程运行时很可能因为方法执行完毕，分支结束等原因弹出当前栈帧，回到上一个栈帧，此时GC根对象的引用关系就可能发生变化。那么问题就是如何检测这种变化？很容易想到就是退回栈时由用户线程去检测变化，重新标记GC根节点（也就是用户线程的一种协作式的标记，和用户线程遇到“坏指针”帮助转移对象一样）那么退回栈后应该扫描多少个栈帧？扫描少了，可能漏标，扫描多了会影响性能。为了降低业务线程扫描栈帧的工作量，HotSpot虚拟机中采用<strong>栈水印</strong>这一机制。<br> 栈水印是一种在运行时栈上的标记，假设线程运行时栈向下增长，发生回栈时，可以区分回到的栈帧是否高于栈水印标记，高于水印标记的栈帧已经被标记完毕，而低于水印标记的栈帧为正在运行的用户线程栈帧。如果回到的栈已经高于栈水印，则此栈不能由 Java 线程直接使用，因为它可能因为引用关系变化而包含过时的对象引用。</p> </li>
  <li> <p>读屏障<br> 栈水印所依赖的一种读屏障。为了降低业务线程扫描栈帧的工作量，HotSpot 中采用单个栈帧扫描的方式，即在回栈时如果超过当前<strong>栈水印标记</strong>，就会进入栈水印屏障，在这个读屏障中会执行一系列操作，去处理当前帧到栈水印标记之前的栈帧，其中因为回栈可能导致引用关系变化的内容。包括修复调用方的对象指针，重新标记此节点的GC根集等。<br> 如果此时GC线程正在标记要回栈的帧，则读屏障会限制用户线程在GC线程标记完成之前不能返回此帧。</p> </li>
  <li> <p>完全并发标记过程</p> 
   <ul>
    <li>完全并发标记GC根集时，GC线程在运行时栈的栈顶下方的栈帧里标记，用户线程在运行时栈的栈顶继续执行。线程通过GC安全点时，将通过改变全局变量的方式在逻辑上使 Java 线程栈失效(判定为非用户线程当前帧)。每个无效的栈将被GC线程同时处理，并且继续跟踪剩余的待处理内容直到完成。</li>
    <li>在应用线程回栈时，操作栈钩子会将一些堆栈本地地址与水印进行比较，如果回栈到栈水印之上，则需要去修复栈帧，并且向上移动水印。每次处理过程都包含对此栈帧的调用方和被调用方的处理，所以处理一般发生在栈顶的两帧上。栈水印屏障则在这两帧的后面，而且在用户线程回栈时，栈水印屏障会检查GC线程是否在处理，GC线程在处理后续的帧时，用户线程不能回栈到此帧。</li>
    <li>Java 线程将处理继续执行所需的最小帧数。并发 GC 线程将处理剩余的帧，确保最终扫描完所有线程栈和其他线程GC根集。</li>
   </ul> </li>
 </ul> 
 <p>栈水印屏障 <code>Stack Watermark Barrier</code>的实现非常复杂，即便是ZGC官方博客也没有对其的详细讲解，有兴趣的可以具体去查看源码。</p> 
 <h2><a id="ZGC__275"></a>ZGC 其他特性</h2> 
 <h3><a id="_276"></a>支持非统一内存访问架构</h3> 
 <blockquote> 
  <p>UMA架构：UMA即Uniform Memory Access Architecture（统一内存访问），UMA也就是一般正常电脑的常用架构，一块内存多颗CPU，所有CPU在处理时都去访问一块内存，所以必然就会出现竞争（争夺内存主线访问权），而操作系统为了避免竞争过程中出现安全性问题，注定着也会伴随锁概念存在，有锁在的场景定然就会影响效率。同时CPU访问内存都需要通过总线和北桥，因此当CPU核数越来越多时，渐渐的总线和北桥就成为瓶颈，从而导致使用UMA/SMP架构机器CPU核数越多，竞争会越大，性能会越低。</p> 
 </blockquote> 
 <blockquote> 
  <p>NUMA架构：NUMA即Non Uniform Memory Access Architecture（非统一内存访问），NUMA架构下，每颗CPU都会对应有一块内存，具体内存取决于处理器的内存位置，一般与CPU对应的内存都是在主板上离该CPU最近的，CPU会优先访问这块内存，每颗CPU各自访问距离自己最近的内存，效率自然而然就提高了。<br> NUMA架构允许多台机器共同组成一个服务供给外部使用，NUMA技术可以使众多服务器像单一系统那样运转，该架构在中大型系统上一直非常盛行，也是高性能的解决方案，尤其在系统延迟方面表现都很优秀，因此，实际上堆空间也可以由多台机器的内存组成。</p> 
 </blockquote> 
 <p>通过NUMA非统一内存访问架构，机器得以纵向扩展，硬件性能堆叠，提供TB级内存单元。<br> ZGC是能自动感知处理器是否是NUMA架构，并可以充分利用NUMA架构特性的一款垃圾收集器。<br> ZGC在NUMA架构的处理器上,为活跃线程分配对象时，会就近分配到此线程所在处理器的优先访问内存上。</p> 
 <h3><a id="_288"></a>就地重定位</h3> 
 <p>ZGC使用的是标记—整理算法，也就是优化的标记-复制算法。此算法有个缺陷，就是要复制或者说移动对象，那么内存中必须存在一定的连续空闲空间用于移动对象，如果堆已满，即所有堆区域都已在使用中，那么我们无处可移动对象。<br> 在 JDK 16 之前，ZGC 通过保留堆解决了这个问题。此保留堆是一组被搁置的堆区域，并且对于来自用户线程的正常分配内存不可用。一般保留堆占整个Java堆的15%左右。使用保留堆的方案仍然存在一些缺陷，首先就是堆内存的浪费，其次是保留堆不一定能完全支持整理过程完成，此时可能导致ZGC失败，发生长时间暂停或堆栈溢出异常。<br> 其他收集器，比如G1，可以通过<strong>就地压缩堆</strong>来处理整理算法的需要空闲空间的问题，这种方法的主要优点是它不需要空闲内存来保证整理堆空间以释放内存。换句话说，它将压缩一个完整的堆，而不需要某种堆空间保留。<br> ZGC中将类似的能力称之为<strong>就地重定位<code>In-Place Relocation</code></strong></p> 
 <ul>
  <li>就地重定位<br> <img src="https://img-blog.csdnimg.cn/d3e4f7751ace4bfeb1f395800447cfa2.png#pic_center" alt="就地重定位"><br> 无连续空闲空间，就地重定位，活动对象按顺序移动的空间0</li>
  <li>非就地重定位<br> <img src="https://img-blog.csdnimg.cn/01109030e518436380af789e0d49ba59.png#pic_center" alt="无需就地重定位"><br> 有连续空闲空间 3，无需就地重定位，按整理算法直接移动活动对象到3号空间</li>
 </ul> 
 <p>但是，就地重定位通常会带来更多的性能开销。例如，就地重定位必须顺序的移动对象，否则可能会覆盖尚未移动的对象。此时GC 线程不能进行并行处理移动对象，并且还会影响 Java 线程操作需要GC整理的对象，在这些对象重新定位时会产生一些操作限制。<br> 当有空闲堆区域可用时，不就地重新定位通常性能更好， 而就地重定位可以保证重新定位过程成功完成，即使没有空堆区域可用。总之，这两种方法都有优点。<br> 从 JDK 16 开始，ZGC 现在同时的使用这两种方法来实现两全其美的效果。这使得即便不使用保留堆 ，仍然可以在普通情况下保持良好的转移对象的性能，并保证即便在无空闲空间的危险情况下，仍然可以实现对象整理。<br> <strong>默认情况下，只要存在可用于将对象移动到的空闲堆区域，ZGC 就不会就地重新定位。否则，ZGC将启用就地重定位。一旦重新有空闲堆区域可用，ZGC将再次切换回不使用地重新定位。</strong></p> 
 <h2><a id="Azul_Zing_C4_GC_305"></a>对比Azul Zing C4 GC</h2> 
 <p>C4收集器由Azul的无暂停垃圾收集器PauseLessGC发展而来，相比PauseLess收集器，C4收集器最大的改进就是支持了分代回收模型。<br> 这有点像ZGC的发展历程，目前(截止JDK18)的ZGC都是不支持分代的，而支持分代的ZGC正在开发中。<br> 有观点认为ZGC就是重写的，纯软件实现的Azul PauseLessGC。目前正在追逐接近C4GC的目标。</p> 
 <p>C4全名 Continuously Concurrent Compacting Collector，连续并发压缩回收器。</p> 
 <p>ZGC的完全并发能力，对应C4的 Continuously Concurrent 连续并发能力<br> ZGC的标记—整理算法，就地重定位能力，对应C4的 Compacting 压缩能力<br> 现在也就差分代回收未实现了。<br> 没有分代回收，ZGC在极高对象分配速率时，仍然不及C4GC。</p> 
 <h2><a id="_316"></a>总结</h2> 
 <h3><a id="ZGC__317"></a>ZGC 优点</h3> 
 <ul>
  <li>低停顿，高吞吐量，ZGC收集过程中额外耗费的内存小。 
   <ul>
    <li>低停顿，几乎所有过程都是并发的，只有短暂的STW。</li>
    <li>占用额外的内存小。G1通过写屏障维护记忆集，才能处理跨代指针，得以实现增量回收。记忆集占用大量内存，写屏障对正常程序造成额外负担。而ZGC没有写屏障，卡表之类的。（但这主要得益于ZGC目前没有实现分代回收，要是分代回收实现之后，还会不会这样不好说了）</li>
    <li>吞吐量方面，在ZGC的‘弱项’吞吐量方面，因为和用户线程并发，还是有影响的。但是以低延迟为首要目标的ZGC已经达到了以高吞吐量为目标Parallel Scavenge收集器的99%,直接<strong>超越了G1</strong>。</li>
   </ul> </li>
  <li>支持NUMA架构<br> 现在多CPU插槽的服务器都是NUMA架构，比如两颗CPU插槽(24核)，64G内存的服务器，那其中一颗CPU上的12个核，访问从属于它的32G本地内存，要比访问另外32G远端内存要快得多。<br> 在支持NUMA架构的多核处理器下，ZGC优先在线程当前所处的处理器的本地内存上分配对象，以保证内存高效访问。</li>
  <li>ZGC采用并发的标记-整理算法。没有内存碎片。</li>
 </ul> 
 <h3><a id="ZGC__326"></a>ZGC 缺点</h3> 
 <ul>
  <li>承受的对象分配速率不会太高，因为浮动垃圾。<br> ZGC的停顿时间是在10ms以下，但是ZGC的执行时间还是远远大于这个时间的。<br> 假如ZGC全过程需要执行10分钟，在这个期间由于对象分配速率很高，将创建大量的新对象，这些对象很难进入当次GC，会被直接判定为存活对象，而本轮GC回收期间可能新分配的对象会有大部分对象都成为了“垃圾”，这些只能等到下次GC才能回收的对象就是<strong>浮动垃圾</strong>。可能造成回收到的内存空间小于期间并发产生的浮动垃圾所占的空间。<br> 这个问题通过分代回收能有很大优化，但是目前ZGC还不支持分代。</li>
  <li>ZGC目前不支持分代回收<br> ZGC目前没有实现分代回收，每次都需要进行全堆扫描，导致一些“朝生夕死”的对象没能及时的被回收。所以就不存在Young GC、Old GC，所有的GC行为都是Full GC。</li>
  <li>ZGC在OpenJDK上只有在JDK17以后才正式可用<br> Oracle HotSpotJDK,Adopt OpenJDK等常用JDK在低版本均无生产可用的ZGC，虽然OpenJDK中的ZGC在Java15中正式生产可用，但是Java17才是Java11之后的下一个长期稳定版。可以通过选择AliJDK，TencentJDK等试用规避此问题。</li>
 </ul> 
 <h2><a id="ZGC_336"></a>ZGC使用</h2> 
 <h3><a id="_337"></a>低版本可用</h3> 
 <p>ZGC在Java15正式生产就绪，而下一个长期支持版的Java为Java 17。这对于一些还在使用低版本JDK的开发者来说是个难题，毕竟升级JDK并不是一蹴而就的容易事。<br> 那么有没有办法在Java11即可使用ZGC呢？也有的</p> 
 <p>国内的话，阿里云开源并维护的<code>Ali DragonWell JDK</code>，腾讯开源并维护的 <code>Tencent Kona JDK</code>,均提供了Java11版本下可用的ZGC。并且移植了大量高版本OpenJDK的特性和ZGC问题的修复，如果要在Java11下使用ZGC，选择以上两家的JDK是最后的选择。</p> 
 <p>并不建议在Java11版本的OpenJDK上使用ZGC，因为存在很多在高版本才修复的问题。</p> 
 <h3><a id="ZGC_344"></a>ZGC参数说明</h3> 
 <p>Java 17下启用ZGC指令</p> 
 <pre><code class="prism language-xml">-XX:+UseZGC 
</code></pre> 
 <p>注意不需要使用G1收集器时的关闭CMS收集器指令,因为CMS收集器已经在Java 9中被删除了。</p> 
 <table>
  <thead>
   <tr>
    <th>通用GC选项</th>
    <th>ZGC选项</th>
    <th>ZGC诊断选项</th>
   </tr>
  </thead>
  <tbody>
   <tr>
    <td>-XX:MinHeapSize, -Xms</td>
    <td>-XX:ZAllocationSpikeTolerance</td>
    <td>-XX:ZStatisticsInterval</td>
   </tr>
   <tr>
    <td>-XX:InitialHeapSize, -Xms</td>
    <td>-XX:ZCollectionInterval</td>
    <td>-XX:ZVerifyForwarding</td>
   </tr>
   <tr>
    <td>-XX:MaxHeapSize, -Xmx</td>
    <td>-XX:ZFragmentationLimit</td>
    <td>-XX:ZVerifyMarking</td>
   </tr>
   <tr>
    <td>-XX:SoftMaxHeapSize</td>
    <td>-XX:ZMarkStackSpaceLimit</td>
    <td>-XX:ZVerifyObjects</td>
   </tr>
   <tr>
    <td>-XX:ConcGCThreads</td>
    <td>-XX:ZProactive</td>
    <td>-XX:ZVerifyRoots</td>
   </tr>
   <tr>
    <td>-XX:ParallelGCThreads</td>
    <td>-XX:ZUncommit</td>
    <td>-XX:ZVerifyViews</td>
   </tr>
   <tr>
    <td>-XX:UseDynamicNumberOfGCThreads</td>
    <td>-XX:ZUncommitDelay</td>
    <td></td>
   </tr>
   <tr>
    <td>-XX:UseLargePages</td>
    <td></td>
    <td></td>
   </tr>
   <tr>
    <td>-XX:UseTransparentHugePages</td>
    <td></td>
    <td></td>
   </tr>
   <tr>
    <td>-XX:UseNUMA</td>
    <td></td>
    <td></td>
   </tr>
   <tr>
    <td>-XX:SoftRefLRUPolicyMSPerMB</td>
    <td></td>
    <td></td>
   </tr>
   <tr>
    <td>-XX:AllocateHeapAt</td>
    <td></td>
    <td></td>
   </tr>
  </tbody>
 </table> 
 <h3><a id="ZGC_366"></a>ZGC的垃圾回收什么情况下会被触发？</h3> 
 <p>ZGC中目前会有四种机制导致GC被触发：</p> 
 <ul>
  <li>①定时触发，默认为不使用，可通过ZCollectionInterval参数配置。</li>
  <li>②预热触发，最多三次，在堆内存达到10%、20%、30%时触发，主要时统计GC时间，为其他GC机制使用。</li>
  <li>③分配速率，基于正态分布统计，计算内存99.9%可能的最大分配速率，以及此速率下内存将要耗尽的时间点，在耗尽之前触发GC「耗尽时间 - 一次GC最大持续时间 - 一次GC检测周期时间」。</li>
  <li>④主动触发，默认开启，可通过ZProactive参数配置，距上次GC堆内存增长10%，或超过5分钟时，对比「距上次GC的间隔时间」和「49*一次GC的最大持续时间」，超过则触发。</li>
 </ul> 
 <h2><a id="ZGC_373"></a>ZGC调优</h2> 
 <p>ZGC 相当智能，我们需要调整的参数很少，由于 ZGC 已经自动将垃圾回收时间控制在 10ms 左右，我们主要关心的是垃圾回收的次数和避免并发回收失败导致的长停顿。</p> 
 <p>ZGC的核心特点是并发，GC过程中一直有新的对象产生。如何保证在GC完成之前，新产生的对象不会将堆占满，是ZGC参数调优的第一大目标。因为在ZGC中，当垃圾来不及回收将堆占满时，会导致正在运行的线程停顿，持续时间可能长达秒级之久。</p> 
 <p>ZGC有多种GC触发机制</p> 
 <ul>
  <li> <p>阻塞内存分配请求触发：<br> 当垃圾来不及回收，垃圾将堆占满时，会导致部分线程阻塞。日志中关键字是“Allocation Stall”。</p> </li>
  <li> <p>基于分配速率的自适应算法：<br> 最主要的 GC 触发方式，其算法原理可简单描述为” ZGC 根据近期的对象分配速率以及 GC 时间，计算出当内存占用达到什么阈值时触发下一次 GC ”。日志中关键字是“Allocation Rate”。</p> </li>
  <li> <p>基于固定时间间隔：<br> 通过ZCollectionInterval控制，适合应对突增流量场景。流量平稳变化时，自适应算法可能在堆使用率达到95%以上才触发GC。流量突增时，自适应算法触发的时机可能会过晚，导致部分线程阻塞。我们通过调整此参数解决流量突增场景的问题，比如定时活动、秒杀等场景。日志中关键字是“Timer”。</p> </li>
  <li> <p>主动触发规则：<br> 类似于固定间隔规则，但时间间隔不固定，是 ZGC 自行算出来的时机。日志中关键字是“Proactive”。其中，最主要使用的是 Allacation Stall GC 和 Allocation Rate GC。我们的调优思路为尽量不出现 Allocation Stall GC , 然后 Allocation Rate GC 尽量少。为了做到不出现 Allocation Stall GC ，我们需要做到垃圾尽量提前回收，不要让堆被占满，所以我们需要在堆内存占满前进行 Allocation Rate GC 。为了 Allocation Rate GC 尽量少，我们需要提高堆的利用率，尽量在堆占用 80% 以上进行 Allocation Rate GC 。基于此，Oracle 官方 ZGC 调优指南只建议我们调整两个参数：</p> </li>
  <li> <p>预热规则：<br> 服务刚启动时出现，一般不需要关注。日志中关键字是“Warmup”。</p> </li>
  <li> <p>外部触发：<br> 代码中显式调用System.gc()触发。 日志中关键字是“System.gc()”。</p> </li>
  <li> <p>元数据分配触发：<br> 元数据区不足时导致，一般不需要关注。 日志中关键字是“Metadata GC Threshold”。</p> </li>
 </ul> 
 <h1><a id="_398"></a>参考</h1> 
 <p><a href="https://blog.csdn.net/weixin_45101064/article/details/123478022">JVM成神路之GC分区篇：G1、ZGC、ShenandoahGC高性能收集器深入剖析</a></p> 
 <p><a href="https://juejin.cn/post/7215485778029609018#heading-29">ZGC在去哪儿机票运价系统实践</a></p> 

## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！