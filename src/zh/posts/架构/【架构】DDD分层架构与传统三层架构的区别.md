---
date: 2023-01-06 06:54:23

title: 【DDD】DDD分层架构与传统三层架构的区别
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)

# 【DDD】DDD分层架构与传统三层架构的区别

### 文章目录

- - [DDD分层与传统三层区别](#DDD_1)
  - [DDD分层详解](#DDD_16)
  - - [四层架构图](#_17)
    - [分层作用](#_24)
    - [领域对象](#_31)
  - [DDD编码实践（改进分层）](#DDD_44)
  - - [代码结构描述](#_53)
    - [扩展定义注解和接口声明](#_115)
    - [领域模型注入仓储类的问题](#_135)
  - [一些个人思考...](#_235)
  - - [项目按上述经典四层架构进行搭建，可以说是DDD架构实践么？](#DDD_242)
    - [题外话：Spring与DDD](#SpringDDD_251)



## DDD分层与传统三层区别

根据DDD领域驱动设计原则，对应的软件架构也需要做出相应的调整。
我们常用的[三层架构](https://so.csdn.net/so/search?q=三层架构&spm=1001.2101.3001.7020)模型划分为表现层，业务逻辑层，数据访问层等，在`DDD`分层结构中既有联系又有区别，
个人认为主要有如下异同：

- 在架构设计上，在`DDD`分层结构中将传统三层架构的业务逻辑层拆解为应用层和领域层
  其中Application划分为很薄的一层服务，非核心的逻辑放到此层去实现，核心的业务逻辑表现下沉到领域层去实现，凝练为更为精确的业务规则集合，通过领域对象去阐述说明。
  ![与传统三层区别](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/20200110163924602.png)
- 在建模方式上，`DDD`分层的建模思维方式有别于传统三层
  传统三层通常是以数据库为起点进行数据库分析设计，而`DDD`则需要以业务[领域模型](https://so.csdn.net/so/search?q=领域模型&spm=1001.2101.3001.7020)为核心建模（即面向对象建模方式），更能体现对现实世界的抽象。
  故**在DDD分层凸显领域层的重要作用，领域层为系统的核心，包括所有的业务领域模型的抽象表达**。
- 在职责划分上，基础设施层涵盖了2方面内容
  - 持久化功能，其中原三层架构的数据访问层下沉到基础设施层的持久化机制实现
  - 通用技术支持，一些公共通用技术支持也放到基础设施层去实现。

## DDD分层详解

### 四层架构图

![在这里插入图片描述](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/20200110164305632.png)

在该架构中，上层模块可以调用下层模块，反之不行。即

- `Interface` ——> `application` | `domain` | `infrastructure`
- `application `——>` domain` | `infrastructure`
- `domain` ——>` infrastructure`

### 分层作用

| 分层       | 英文                   | 描述                                                         |
| ---------- | ---------------------- | ------------------------------------------------------------ |
| 表现层     | `User Interface`       | 用户界面层，或者表现层，负责向用户显示解释用户命令           |
| 应用层     | `Application Layer`    | 定义软件要完成的任务，并且指挥协调领域对象进行不同的操作。该层不包含业务领域知识。 |
| 领域层     | `Domain Layer`         | 或称为模型层，系统的核心，负责表达业务概念，业务状态信息以及业务规则。即包含了该领域（问题域）所有复杂的业务知识抽象和规则定义。该层主要精力要放在领域对象分析上，可以从实体，值对象，聚合（聚合根），领域服务，领域事件，仓储，工厂等方面入手 |
| 基础设施层 | `Infrastructure Layer` | 主要有2方面内容，一是为领域模型提供持久化机制，当软件需要持久化能力时候才需要进行规划；一是对其他层提供通用的技术支持能力，如消息通信，通用工具，配置等的实现； |

### 领域对象

根据战术设计，关注的领域对象主要包括有

| 类型           | 英文           | 描述                                   |
| -------------- | -------------- | -------------------------------------- |
| 值对象         | `value object` | 无唯一标识的简单对象                   |
| 实体           | `entity`       | 充血的领域模型，有唯一标识             |
| 聚合（聚合根） | `aggregate`    | 实体的聚合，拥有聚合根，可为某一个实体 |
| 领域服务       | `service`      | 无法归类到某个具体领域模型的行为       |
| 领域事件       | `event`        | 不常用                                 |
| 仓储           | `repository`   | 持久化相关，与基础设施层关联           |
| 工厂           | `factory`      | 负责复杂对象创建                       |
| 模块           | `module`       | 子模块引入，可以理解为子域划分         |

## DDD编码实践（改进分层）

本文在对上述的传统四层的实践中，（1）根据`依赖倒置原则`对分层结构进行了改进，通过改变不同层的依赖关系（即将基础设施层倒置）来改进具体实现与抽象之间关系；（2）在基础设施层中增加`引用适配层`（防腐层）来增强防御策略，用来统一封装外部系统接口的引用。改进的分层结构如下：
![在这里插入图片描述](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/74de60360d744758993b3ba54ac20370.png)

> 依赖倒置原则（DIP）：
>
> - 高层模块不依赖于低层模块，两者都依赖于抽象；
> - 抽象不应该依赖于细节，细节应依赖抽象

### 代码结构描述

`eg.`后端Java代码工程为例，
`表现层`在此代码结构中表现为`api层`，对外暴露接口的最上层

```java
├─com.company.microservice
├─com.company.microservice
│    │ 
│    ├─apis   API接口层 
│    │    └─controller       控制器，对外提供（Restful）接口
│    │ 
│    ├─application           应用层
│    │    ├─model            数据传输对象模型及其装配器（含校验）
│    │    │    ├─assembler   装配器,，实现模型转换eg. apiModel<=> domainModel
│    │    │    └─dto         模型定义（含校验规则）      
│    │    ├─service          应用服务，非核心服务，跨领域的协作、复杂分页查询等
│    │    ├─task             任务定义，协调领域模型
│    │    ├─listener         事件监听定义
│    │    └─***              others
│    │ 
│    ├─domain   领域层
│    │    ├─common           模块0-公共代码抽取，限于领域层有效  
│    │    ├─module-xxx       模块1-xxx，领域划分的模块，可理解为子域划分     
│    │    ├─module-user      模块2-用户子域（领域划分的模块，可理解为子域划分）
│    │    │    ├─action      行为定义
│    │    │    │    ├─UserDomainService.java        领域服务,用户领域服务
│    │    │    │    ├─UserPermissionChecker.java    其他行为，用户权限检查器
│    │    │    │    ├─WhenUserCreatedEventPublisher.java     领域事件，当用户创建完成时的事件 
│    │    │    ├─model       领域聚合内模型 
│    │    │    │    ├─UserEntity.java                领域实体，有唯一标识的充血模型，如本身的CRUD操作在此处
│    │    │    │    ├─UserDictVObj.java              领域值对象，用户字典kv定义       
│    │    │    |    ├─UserDPO.java                   领域负载对象    
│    │    │    ├─repostiory  领域仓储接口
│    │    │    │    ├─UserRepository.java
│    │    │    ├─reference   领域适配接口
│    │    │    │    ├─UserEmailSenderFacade.java
│    │    │    └─factory     领域工厂  
│    │ 
│    ├─infrastructure  基础设施层
│    │    ├─persistence      持久化机制
│    │    │    ├─converter   持久化模型转换器
│    │    │    ├─po          持久化对象定义 
│    │    │    └─repository.impl  仓储类，持久化接口&实现，可与ORM映射框架结合
│    │    ├─general          通用技术支持，向其他层输出通用服务
│    │    │    ├─config      配置类
│    │    │    ├─toolkit     工具类  
│    │    │    ├─extension   扩展定义  
│    │    │    └─common      基础公共模块等 
│    │    ├─reference        引用层，包装外部接口用，防止穿插到Domain层腐化领域模型等
│    │    │    ├─dto         传输模型定义
│    │    │    ├─converter   传输模型转换器       
│    │    │    └─facade.impl 适配器具体实现，此处的RPC、Http等调用
│    │ 
│    └─resources  
│        ├─statics  静态资源
│        ├─template 系统页面 
│        └─application.yml   全局配置文件

```

其中在上述目录结构中，Domain层中为对`module`进行划分，实际上默认该层只有一个模块，根据微服务划分可以进行增加模块来规范代码结构。
示例代码工程：

GITHUB地址：https://github.com/smingjie/bbq-ddd.git

### 扩展定义注解和接口声明

（1）`自定义注解`：在使用DDD中自定义了标记的注解( @DDDAnnotation)和其衍生子注解，分别是

- `@DomainAggregate`
- `@DomainAggregateRoot`
- `@DomainEntity`
- `@DomainValueObject`
- `@DomainService`
- `@DomainRepository`
- `@DomainEvent`
- `@ApplicationService`
- `@DomainAssembler`
- `@DomainConverter`

等注解,详见代码的infrastructure.general.extension.ddd.annotation.**；其中有些注解继承了spring的 `@Component`,将会自动注册为spring bean，有些注解为了标记用于后续扩展；

引入了 Assembler装配器/Converter转换器，通过组合模式解耦继承关系，在api层和持久化层都有相应的实现。

（2）`自定义接口`：在domain.common定义了部分通用的`契约`接口，如领域对象元数据获取接口 `IDomainMetaData`，通过接口解耦继承关系。其他还有： `IDomainSaveOrUpdate` `IDomainDelete` `...` 等Command

### 领域模型注入仓储类的问题

区别于传统的分层后，在domain中更多关注业务逻辑，考虑到要与spring框架集成，需要注意一个领域模型中注入仓储类的问题

> 在传统分层中，controller，service，repo均注册为spring管理的bean，
> 但是在domain层中，service一部分的业务逻辑划分到了具体的领域对象中去实现了，显然这些对象却不能注册为单例bean，
> 因此在此处不能沿用与原来分层结构中service层中通过`@Autowired` or `@Resource`等注入仓储接口，

**关于这个问题，此处建议使用`ApplicationContext`实现**

> 即通过一个工具类 `ApplicationContextUtils` 实现 `ApplicationContextAware`获取bean的方法，即 `getBean()`方法，
> 然后我们就可以在我们的领域模型中直接应用该工具类来获取Spring托管的singleton对象，即
> xxxRepo=ApplicationContextUtils.getBean(“xxxRepository”)

```java
@Component
public class ApplicationContextUtils implements ApplicationContextAware {

    public static ApplicationContext appctx;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        ApplicationContextUtil.appctx=applicationContext;
    } 

    /**
     * @return ApplicationContext
     */
    public static ApplicationContext getApplicationContext() {
        return appctx;
    }

    /**
     * 获取对象
     *
     * @param name spring配置文件中配置的bean名或注解的名称
     * @return 一个以所给名字注册的bean的实例
     * @throws BeansException 抛出spring异常
     */ 
    public static <T> T getBean(String name) throws BeansException {
        return (T) appctx.getBean(name);
    }

    /**
     * 获取类型为requiredType的对象
     *
     * @param clazz 需要获取的bean的类型
     * @return 该类型的一个在ioc容器中的bean
     * @throws BeansException 抛出spring异常
     */
    public static <T> T getBean(Class<T> clazz) throws BeansException {
        return appctx.getBean(clazz);
    }

    /**
     * 如果ioc容器中包含一个与所给名称匹配的bean定义，则返回true否则返回false
     *
     * @param name ioc容器中注册的bean名称
     * @return 存在返回true否则返回false
     */
    public static boolean containsBean(String name) {
        return appctx.containsBean(name);
    }
}
```

考虑到代码结构简洁性，还可以封装一层仓储工厂，只用来获取相应的仓储`Bean` 。

```java
/**
 * 简化版的仓储工厂--用来统一获取仓储的实现Bean
 *
 * @author jockeys
 * @date 2020/9/12
 */
public class RepoFactory {

	/**
	 * 根据仓储接口类型获取对应实现且默认取值第一个
	 *
	 * @param tClass 具体目标类型
	 * @param <T>    仓储接口类型
	 * @return 如果不是指定实现，默认获得第一个实现Bean
	 */
	public static <T> T get(Class<? extends T> tClass) {

		Map<String, ? extends T> map = ApplicationUtils.getApplicationContext().getBeansOfType(tClass);
		Collection<? extends T> collection = map.values();
		if (collection.isEmpty()) {
			throw new PersistException("未找到仓储接口或其指定的实现:" + tClass.getSimpleName() );
		}
		return collection.stream().findFirst().get();
	}
}
```

然后在领域模型中就可以直接调用该工厂方法来获取仓储接口的实现，
比如`DictRepo`为定义的仓储接口，`DictDao`为该接口的准实现类

```java
//直接指定实现
DictRepo repo= RepoFactory.get(DictDao.class);
//不指定实现取Spring容器中默认注册第1位的Bean
DictRepo repo= RepoFactory.get(DictRepo.class);
```

## 一些个人思考…

上述经典四层架构，笔者更愿意理解为DDD在编码实现阶段的一个体现或应用。

> 补充一点：DDD除了在编码实践阶段，还体现在需求分析、设计阶段等过程，DDD推荐不割裂系统的需求和设计，我们这里可以合并称作系统建模过程，可参考 [DDD-建模过程分析](https://blog.csdn.net/whos2016/article/details/103430565)一文，不再赘述。

当然除了这个经典四层架构模型，DDD还有五层架构、六边形架构等，所以这里抛出一个问题，

### 项目按上述经典四层架构进行搭建，可以说是DDD架构实践么？

关于这个问题，笔者想引入一对哲学概念，哲学有言形式与内容，现象与本质等辩证关系（当然与本文可能也没啥太大关系啦）；从这两个角度来阐述本人的观点：

- 形式与内容：经典四层架构是一个DDD实现的形式，相当于给我们提供了一个框框来让我们自己去实现；在这个框框里面我们怎么实现是自由发挥的，但也是有约束的，这个约束体现在DDD对每一层的作用的约定，如每个层约定做了什么功能，充当什么角色等。**尤其是对Domain层的约定，才是最重要的**。那么我们按照哲学辩证的套话来说，***形式上满足了DDD架构，但这应该是片面的，具体还要看内容，即具体实现是怎样的。***

- 现象与本质：接着上述观点，如果要看实现，就要具体分析一下现象与本质嘞。上面笔者也有提到，DDD除了四层经典架构，还有五层架构（包括其演化的多层架构）、六边形架构等也都是DDD提供的架构模型（形式），那这些都可以理解DDD架构模式的外显形式，那么又有哪些共性呢？可自行查询，本文直接给结论，即

  它们都有Domain层，Domain层，Domain层

  （重要的事情说三遍~~，该结论DDD作者译著有写到…），所以不管架构模式怎么演化，Domain是核心不能变。

  那么如上分析，我们在回到这个问题，我们是不是可以给出一个这样的答案：

  > 形式上符合DDD架构，具体是不是DDD的架构实践，本质上还要看
  >
  > - （1）项目是否包括有Domain层；
  > - （2）Domain层是否满足DDD战术篇的要求（或者可暂时简单理解为充血模型吧）

### 题外话：Spring与DDD

- Spring框架中，Spring为我们提供了`@Service` `@Repository` 等注解，为我们分离行为和行为（注册为Bean）和属性（数据模型），同时通过`@Autowired`在合适地方进行注入行为，因为行为被注册为Spring容器中的Bean后，减少了频繁创建行为的开销，只有属性的数据模型作为数据的载体来传递数据。提供很大的便捷性。但也阻碍了我们应用DDD编码实践， Spring框架主张分离，DDD思想主张合并，我们在Spring框架中使用DDD则需要在其基础上进行一些权衡取舍，即 ***如何将注册为Bean的行为穿插到原有的贫血模型中来构建充血模型是我们要解决的问题***
- 关于这个问题，笔者使用了Spring框架提供的**获取容器内已经注册的Bean接口**，直接调用接口，在有属性的领域模型中来获取行为；主要还是体现融入领域模型中的部分Service获取仓储接口来实现持久化过程。

当然，上述的说明都是从一个软件开发人员的角度来阐述说明DDD在编码实践阶段的应用 。
除此之外在业务领域的建模分析过程中也可引入该概念。
比如我们现在所倡导的微服务化，如何划分或拆分微服务；如何有效地区分限界上下文，划分子域；如何构建一个有效的聚合，识别聚合根等。。。

- 附在最后的，关于笔者对于DDD在需求设计阶段应用的学习总结
- [DDD-建模分析过程](https://blog.csdn.net/whos2016/article/details/103430565)

![](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)
