---
date: 2023-04-27 17:20:49

title: 【MySQL】21个MySQL表设计的经验准则
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)
## 【MySQL】21个MySQL表设计的经验准则
<div id="content_views" class="markdown_views prism-atom-one-dark"> 
 <svg xmlns="http://www.w3.org/2000/svg" style="display: none;"> <path stroke-linecap="round" d="M5,0 0,2.5 5,5z" id="raphael-marker-block" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></path> 
 </svg> 
 <h2><a id="1_0"></a>1.命名规范</h2> 
 <p>数据库表名、字段名、索引名等都需要命名规范，可读性高(一般要求用英文)，让别人一看命名，就知道这个字段表示什么意思。</p> 
 <p>比如一个表的账号字段，<strong>反例如下</strong>：</p> 
 <pre><code>acc_no,1_acc_no,zhanghao
</code></pre> 
 <p><strong>正例：</strong></p> 
 <pre><code>account_no,account_number
</code></pre> 
 <ul>
  <li>表名、字段名必须使用小写字母或者数字，禁止使用数字开头，禁止使用拼音，并且一般不使用英文缩写。</li>
  <li>主键索引名为<code>pk_字段名</code>；唯一索引名为<code>uk_字段名</code>；普通索引名则为<code>idx_字段名</code>。</li>
 </ul> 
 <h2><a id="2_18"></a>2.选择合适的字段类型</h2> 
 <p>设计表时，我们需要选择合适的字段类型，比如：</p> 
 <ul>
  <li>尽可能选择存储空间小的字段类型，就好像数字类型的，从<code>tinyint、smallint、int、bigint</code>从左往右开始选择</li>
  <li>小数类型如金额，则选择 <code>decimal</code>，禁止使用 <code>float</code> 和 <code>double</code>。</li>
  <li>如果存储的字符串长度几乎相等，使用 <code>char</code> 定长字符串类型。</li>
  <li><code>varchar</code>是可变长字符串，不预先分配存储空间，长度不要超过<code>5000</code>。</li>
  <li>如果存储的值太大，建议字段类型修改为<code>text</code>，同时抽出单独一张表，用主键与之对应。</li>
  <li>同一表中，所有<code>varchar</code>字段的长度加起来，不能大于<code>65535</code>. 如果有这样的需求，请使用<code>TEXT/LONGTEXT</code> 类型。</li>
 </ul> 
 <h2><a id="3__29"></a>3. 主键设计要合理</h2> 
 <p>主键设计的话，最好不要与业务逻辑有所关联。有些业务上的字段，比如身份证，虽然是唯一的，一些开发者喜欢用它来做主键，但是不是很建议哈。主键最好是毫无意义的一串独立不重复的数字，比如<code>UUID</code>，又或者<code>Auto_increment</code>自增的主键，或者是雪花算法生成的主键等等;</p> 
 <p><img src="https://img-blog.csdnimg.cn/img_convert/ccd1bc85b0ee0b89a50656597486178d.png" alt=""></p> 
 <h2><a id="4__35"></a>4. 选择合适的字段长度</h2> 
 <p>先问大家一个问题，大家知道数据库字段长度表示<strong>字符长度</strong>还是<strong>字节长度</strong>嘛？</p> 
 <blockquote> 
  <p>其实在mysql中，<code>varchar</code>和<code>char</code>类型表示字符长度，而其他类型表示的长度都表示字节长度。比如<code>char(10)</code>表示字符长度是10，而<code>bigint（4）</code>表示显示长度是<code>4</code>个字节，但是因为bigint实际长度是<code>8</code>个字节，所以bigint（4）的实际长度就是8个字节。</p> 
 </blockquote> 
 <p>我们在设计表的时候，需要充分考虑一个字段的长度，比如一个用户名字段（它的长度5~20个字符），你觉得应该设置多长呢？可以考虑设置为 <code>username varchar（32）</code>。字段长度一般设置为2的幂哈（也就是<code>2的n</code>次方）。’;</p> 
 <h2><a id="5_43"></a>5，优先考虑逻辑删除，而不是物理删除</h2> 
 <p>什么是物理删除？什么是逻辑删除？</p> 
 <ul>
  <li>物理删除：把数据从硬盘中删除，可释放存储空间</li>
  <li>逻辑删除：给数据添加一个字段，比如<code>is_deleted</code>，以标记该数据已经逻辑删除。</li>
 </ul> 
 <p>物理删除就是执行<code>delete</code>语句，如删除<code>account_no =‘666’</code>的账户信息SQL如下：</p> 
 <pre><code>delete from account_info_tab whereaccount_no ='666';
</code></pre> 
 <p>逻辑删除呢，就是这样：</p> 
 <pre><code>update account_info_tab set is_deleted = 1 where account_no ='666';
</code></pre> 
 <p><strong>为什么推荐用逻辑删除，不推荐物理删除呢？</strong></p> 
 <blockquote> 
  <ul>
   <li>为什么不推荐使用物理删除，因为恢复数据很困难</li>
   <li>物理删除会使自增主键不再连续</li>
   <li>核心业务表 的数据不建议做物理删除，只适合做状态变更。</li>
  </ul> 
 </blockquote> 
 <h2><a id="6_create_timemodifed_time_66"></a>6. 每个表都需要添加这几个通用字段如主键、create_time、modifed_time等</h2> 
 <p>表必备一般来说，或具备这几个字段：</p> 
 <ul>
  <li>id：主键，一个表必须得有主键，必须</li>
  <li>create_time：创建时间，必须</li>
  <li>modifed_time/update_time: 修改时间，必须，更新记录时，需要更新它</li>
  <li>version : 数据记录的版本号，用于乐观锁，非必须</li>
  <li>remark ：数据记录备注，非必须</li>
  <li>modified_by :修改人，非必须</li>
  <li>creator ：创建人，非必须</li>
 </ul> 
 <p><img src="https://img-blog.csdnimg.cn/img_convert/5c0c0ff67e3189ae7899070386491415.png" alt=""></p> 
 <h2><a id="7__80"></a>7. 一张表的字段不宜过多</h2> 
 <p>我们建表的时候，要牢记，一张表的字段不宜过多哈，一般尽量不要超过20个字段哈。笔者记得上个公司，有伙伴设计开户表，加了五十多个字段。。。</p> 
 <p>如果一张表的字段过多，表中保存的数据可能就会很大，查询效率就会很低。因此，一张表不要设计太多字段哈，如果业务需求，实在需要很多字段，可以把一张大的表，拆成多张小的表，它们的主键相同即可。</p> 
 <p>当表的字段数非常多时，可以将表分成两张表，一张作为条件查询表，一张作为详细内容表 (主要是为了性能考虑)。</p> 
 <h2><a id="8_not_null_88"></a>8. 尽可能使用not null定义字段</h2> 
 <p>如果没有特殊的理由， 一般都建议将字段定义为 <code>NOT NULL</code> 。</p> 
 <p><strong>为什么呢？</strong></p> 
 <ul>
  <li>首先， <code>NOT NULL</code> 可以防止出现空指针问题。</li>
  <li>其次，<code>NULL</code>值存储也需要额外的空间的，它也会导致比较运算更为复杂，使优化器难以优化SQL。</li>
  <li><code>NULL</code>值有可能会导致索引失效</li>
  <li>如果将字段默认设置成一个空字符串或常量值并没有什么不同，且都不会影响到应用逻辑， 那就可以将这个字段设置为<code>NOT NULL</code>。</li>
 </ul> 
 <h2><a id="9__99"></a>9. 设计表时，评估哪些字段需要加索引</h2> 
 <p>首先，评估你的表数据量。如果你的表数据量只有一百几十行，就没有必要加索引。否则设计表的时候，如果有查询条件的字段，一般就需要建立索引。但是索引也不能滥用：</p> 
 <ul>
  <li>索引也不要建得太多，一般单表索引个数不要超过<code>5</code>个。因为创建过多的索引，会降低写得速度。</li>
  <li>区分度不高的字段，不能加索引，如性别等</li>
  <li>索引创建完后，还是要注意避免索引失效的情况，如使用mysql的内置函数，会导致索引失效的</li>
  <li>索引过多的话，可以通过联合索引的话方式来优化。然后的话，索引还有一些规则，如覆盖索引，最左匹配原则等等。。</li>
 </ul> 
 <p>假设你新建一张用户表，如下：</p> 
 <pre><code>CREATE TABLE user_info_tab (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `age` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `create_time` datetime NOT NULL,
  `modifed_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
</code></pre> 
 <p>对于这张表，很可能会有根据<code>user_id</code>或者<code>name</code>查询用户信息，并且，<code>user_id</code>是唯一的。因此，你是可以给<code>user_id</code>加上唯一索引，<code>name</code>加上普通索引。</p> 
 <pre><code>CREATE TABLE user_info_tab (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `age` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `create_time` datetime NOT NULL,
  `modifed_time` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_name` (`name`) USING BTREE,
  UNIQUE KEY un_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
</code></pre> 
 <h2><a id="10__3NF_138"></a>10. 不需要严格遵守 3NF，通过业务字段冗余来减少表关联</h2> 
 <p>什么是数据库三范式（<code>3NF</code>），大家是否还有印象吗？</p> 
 <ul>
  <li>第一范式：对属性的原子性，要求属性具有原子性，不可再分解；</li>
  <li>第二范式：对记录的唯一性，要求记录有唯一标识，即实体的唯一性，即不存在部分依赖；</li>
  <li>第三方式：对字段的冗余性，要求任何字段不能由其他字段派生出来，它要求字段没有冗余，即不存在传递依赖；</li>
 </ul> 
 <p>我们设计表及其字段之间的关系, 应尽量满足第三范式。但是有时候，可以适当冗余，来提高效率。比如以下这张表</p> 
 <table>
  <thead>
   <tr>
    <th>商品名称</th>
    <th>商品型号</th>
    <th>单价</th>
    <th>数量</th>
    <th>总金额</th>
   </tr>
  </thead>
  <tbody>
   <tr>
    <td>手机</td>
    <td>华为</td>
    <td>8000</td>
    <td>5</td>
    <td>40000</td>
   </tr>
  </tbody>
 </table> 
 <p>以上这张存放商品信息的基本表。<code>总金额</code>这个字段的存在，表明该表的设计不满足第三范式，因为<code>总金额</code>可以由<code>单价*数量</code>得到，说明<code>总金额</code>是冗余字段。但是，增加<code>总金额</code>这个冗余字段，可以提高查询统计的速度，这就是以空间换时间的作法。</p> 
 <p>当然，这只是个小例子哈，大家开发设计的时候，要结合具体业务分析哈。</p> 
 <h2><a id="11_MySQL_156"></a>11. 避免使用MySQL保留字</h2> 
 <p>如果库名、表名、字段名等属性含有保留字时，<code>SQL</code>语句必须用反引号来引用属性名称，这将使得SQL语句书写、SHELL脚本中变量的转义等变得非常复杂。</p> 
 <p>因此，我们一般避免使用<code>MySQL</code>保留字，如<code>select、interval、desc</code>等等</p> 
 <h2><a id="12__162"></a>12. 不搞外键关联，一般都在代码维护</h2> 
 <p>什么是外键呢？</p> 
 <blockquote> 
  <p>外键，也叫<code>FOREIGN KEY</code>，它是用于将两个表连接在一起的键。<code>FOREIGN KEY</code>是一个表中的一个字段（或字段集合），它引用另一个表中的<code>PRIMARY KEY</code>。它是用来保证数据的一致性和完整性的。</p> 
 </blockquote> 
 <p>阿里的<code>Java</code>规范也有这么一条：</p> 
 <blockquote> 
  <p>【强制】<strong>不得使用外键与级联</strong>，一切外键概念必须在应用层解决。</p> 
 </blockquote> 
 <p>我们为什么不推荐使用<strong>外键</strong>呢？</p> 
 <blockquote> 
  <ul>
   <li>使用外键存在性能问题、并发死锁问题、使用起来不方便等等。每次做<code>DELETE</code>或者<code>UPDATE</code>都必须考虑外键约束，会导致开发的时候很难受,测试数据造数据也不方便。</li>
   <li>还有一个场景不能使用外键，就是分库分表。</li>
  </ul> 
 </blockquote> 
 <h2><a id="13_INNODB_177"></a>13. 一般都选择INNODB存储引擎</h2> 
 <p>建表是需要选择<strong>存储引擎</strong>的，我们一般都选择<code>INNODB</code>存储引擎，除非读写比率小于<code>1%</code>, 才考虑使用<code>MyISAM</code> 。</p> 
 <p>有些小伙伴可能会有疑惑，不是还有<code>MEMORY</code>等其他存储引擎吗？什么时候使用它呢？其实其他存储引擎一般除了都建议在<code>DBA</code>的指导下使用。</p> 
 <p>我们来复习一下这<code>MySQL</code>这三种存储引擎的对比区别吧：</p> 
 <table>
  <thead>
   <tr>
    <th>特性</th>
    <th>INNODB</th>
    <th>MyISAM</th>
    <th>MEMORY</th>
   </tr>
  </thead>
  <tbody>
   <tr>
    <td>事务安全</td>
    <td>支持</td>
    <td>无</td>
    <td>无</td>
   </tr>
   <tr>
    <td>存储限制</td>
    <td>64TB</td>
    <td>有</td>
    <td>有</td>
   </tr>
   <tr>
    <td>空间使用</td>
    <td>高</td>
    <td>低</td>
    <td>低</td>
   </tr>
   <tr>
    <td>内存使用</td>
    <td>高</td>
    <td>低</td>
    <td>高</td>
   </tr>
   <tr>
    <td>插入数据速度</td>
    <td>低</td>
    <td>高</td>
    <td>高</td>
   </tr>
   <tr>
    <td>是否支持外键</td>
    <td>支持</td>
    <td>无</td>
    <td>无</td>
   </tr>
  </tbody>
 </table> 
 <h2><a id="14__194"></a>14. 选择合适统一的字符集。</h2> 
 <p>数据库库、表、开发程序等都需要统一字符集，通常中英文环境用<code>utf8</code>。</p> 
 <p>MySQL支持的字符集有<code>utf8、utf8mb4、GBK、latin1</code>等。</p> 
 <ul>
  <li>utf8：支持中英文混合场景，国际通过，3个字节长度</li>
  <li>utf8mb4: &nbsp; 完全兼容utf8，4个字节长度，一般存储<strong>emoji表情</strong>需要用到它。</li>
  <li>GBK ：支持中文，但是不支持国际通用字符集，2个字节长度</li>
  <li>latin1：MySQL默认字符集，1个字节长度</li>
 </ul> 
 <h2><a id="15_comment_205"></a>15. 如果你的数据库字段是枚举类型的，需要在comment注释清楚</h2> 
 <p>如果你设计的数据库字段是枚举类型的话，就需要在<code>comment</code>后面注释清楚每个枚举的意思，以便于维护</p> 
 <p>正例如下：</p> 
 <pre><code>`session_status` varchar(2) COLLATE utf8_bin NOT NULL COMMENT 'session授权态 00：在线-授权态有效 01：下线-授权态失效 02：下线-主动退出 03：下线-在别处被登录'
</code></pre> 
 <p>反例：</p> 
 <pre><code>`session_status` varchar(2) COLLATE utf8_bin NOT NULL COMMENT 'session授权态'
</code></pre> 
 <p>并且，如果你的枚举类型在未来的版本有增加修改的话，也需要同时维护到<code>comment</code>后面。</p> 
 <h2><a id="16_222"></a>16.时间的类型选择</h2> 
 <p>我们设计表的时候，一般都需要加通用时间的字段，如<code>create_time、modified_time</code>等等。那对于时间的类型，我们该如何选择呢？</p> 
 <p>对于MySQL来说，主要有<code>date、datetime、time、timestamp 和 year</code>。</p> 
 <ul>
  <li>date ：表示的日期值, 格式<code>yyyy-mm-dd</code>,范围<code>1000-01-01 到 9999-12-31</code>，3字节</li>
  <li>time ：表示的时间值，格式 <code>hh:mm:ss</code>，范围<code>-838:59:59 到 838:59:59</code>，3字节</li>
  <li>datetime：表示的日期时间值，格式<code>yyyy-mm-dd hh:mm:ss</code>，范围<code>1000-01-01 00:00:00到</code>9999-12-31 23:59:59```,8字节，跟时区无关</li>
  <li>timestamp：表示的时间戳值，格式为<code>yyyymmddhhmmss</code>，范围<code>1970-01-01 00:00:01到2038-01-19 03:14:07</code>，4字节，跟时区有关</li>
  <li>year：年份值，格式为<code>yyyy</code>。范围<code>1901到2155</code>，1字节</li>
 </ul> 
 <p>推荐优先使用<code>datetime</code>类型来保存日期和时间，因为存储范围更大，且跟时区无关。</p> 
 <h2><a id="17_Stored_procedure___236"></a>17. 不建议使用Stored procedure (包括存储过程，触发器) 。</h2> 
 <p><strong>什么是存储过程</strong></p> 
 <p>已预编译为一个可执行过程的一个或多个SQL语句。</p> 
 <p><strong>什么是触发器</strong></p> 
 <p>触发器，指一段代码，当触发某个事件时，自动执行这些代码。使用场景：</p> 
 <ul>
  <li>可以通过数据库中的相关表实现级联更改。</li>
  <li>实时监控某张表中的某个字段的更改而需要做出相应的处理。</li>
  <li>例如可以生成某些业务的编号。</li>
  <li>注意不要滥用，否则会造成数据库及应用程序的维护困难。</li>
 </ul> 
 <p>对于MYSQL来说，存储过程、触发器等还不是很成熟， 并没有完善的出错记录处理，不建议使用。</p> 
 <h2><a id="18_1N__253"></a>18. 1:N 关系的设计</h2> 
 <p>日常开发中，<code>1</code>对多的关系应该是非常常见的。比如一个班级有多个学生，一个部门有多个员工等等。这种的建表原则就是：在从表（<code>N</code>的这一方）创建一个字段，以字段作为外键指向主表（<code>1</code>的这一方）的主键。示意图如下:</p> 
 <p><img src="https://img-blog.csdnimg.cn/img_convert/16838d39a5d92370407a0bb83f69c511.png" alt=""></p> 
 <p>学生表是多（<code>N</code>）的一方，会有个字段<code>class_id</code>保存班级表的主键。当然，一班不加外键约束哈，只是单纯保存这个关系而已。</p> 
 <p>有时候两张表存在<code>N:N</code>关系时，我们应该消除这种关系。通过增加第三张表，把<code>N:N</code>修改为两个 <code>1:N</code>。比如图书和读者，是一个典型的多对多的关系。一本书可以被多个读者借，一个读者又可以借多本书。我们就可以设计一个借书表，包含图书表的主键，以及读者的主键，以及借还标记等字段。</p> 
 <h2><a id="19__263"></a>19. 大字段</h2> 
 <p>设计表的时候，我们尤其需要关注一些大字段，即占用较多存储空间的字段。比如用来记录用户评论的字段，又或者记录博客内容的字段，又或者保存合同数据的字段。如果直接把表字段设计成text类型的话，就会浪费存储空间，查询效率也不好。</p> 
 <p>在MySQl中，这种方式保存的设计方案，其实是不太合理的。这种非常大的数据，可以保存到<code>mongodb</code>中，然后，在业务表保存对应<code>mongodb</code>的<code>id</code>即可。</p> 
 <p>这种设计思想类似于，我们表字段保存图片时，为什么不是保存图片内容，而是直接保存图片url即可。</p> 
 <h2><a id="20__271"></a>20. 考虑是否需要分库分表</h2> 
 <p><strong>什么是分库分表呢？</strong></p> 
 <ul>
  <li>分库：就是一个数据库分成多个数据库，部署到不同机器。</li>
 </ul> 
 <p><img src="https://img-blog.csdnimg.cn/img_convert/b2cf7a062366981d0097856ac608eb09.png" alt=""></p> 
 <ul>
  <li>分表：就是一个数据库表分成多个表。</li>
 </ul> 
 <p><img src="https://img-blog.csdnimg.cn/img_convert/4198e1532e4032a024e81f66f904f38c.png" alt=""></p> 
 <p>我们在设计表的时候，其实可以提前估算一下，是否需要做<strong>分库分表</strong>。比如一些用户信息，未来可能数据量到达百万设置千万的话，就可以提前考虑分库分表。</p> 
 <blockquote> 
  <p><strong>为什么需要分库分表</strong>: 数据量太大的话，SQL的查询就会变慢。如果一个查询SQL没命中索引，千百万数据量级别的表可能会拖垮整个数据库。即使SQL命中了索引，如果表的数据量超过一千万的话，查询也是会明显变慢的。这是因为索引一般是B+树结构，数据千万级别的话，B+树的高度会增高，查询就变慢啦。</p> 
 </blockquote> 
 <p>分库分表主要有水平拆分、垂直拆分的说法，拆分策略有<code>range范围、hash取模</code>。而分库分表主要有这些问题：</p> 
 <ul>
  <li>事务问题</li>
  <li>跨库关联</li>
  <li>排序问题</li>
  <li>分页问题</li>
  <li>分布式ID</li>
 </ul> 
 <h2><a id="21_sqL__295"></a>21. sqL 编写的一些优化经验</h2> 
 <p>最后的话，跟大家聊来一些写SQL的经验吧：</p> 
 <ul>
  <li>查询SQL尽量不要使用<code>select *</code>，而是<code>select</code>具体字段</li>
  <li>如果知道查询结果只有一条或者只要最大/最小一条记录，建议用<code>limit 1</code></li>
  <li>应尽量避免在<code>where</code>子句中使用<code>or</code>来连接条件</li>
  <li>注意优化<code>limit</code>深分页问题</li>
  <li>使用<code>where</code>条件限定要查询的数据，避免返回多余的行</li>
  <li>尽量避免在索引列上使用<code>mysql</code>的内置函数</li>
  <li>应尽量避免在 <code>where</code>子句中对字段进行表达式操作</li>
  <li>应尽量避免在<code>where</code> 子句中使用<code>!=</code>或<code>&lt;&gt;</code>操作符</li>
  <li>使用联合索引时，注意索引列的顺序，一般遵循最左匹配原则。</li>
  <li>对查询进行优化，应考虑在<code>where 及 order by</code>涉及的列上建立索引</li>
  <li>如果插入数据过多，考虑批量插入</li>
  <li>在适当的时候，使用覆盖索引</li>
  <li>使用explain 分析你SQL的计划</li>
 </ul> 

## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！