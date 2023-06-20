---
date: 2022-04-05 19:07:55

title: CAS-ABA问题
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# CAS-ABA问题

## 一.概述：

​		ABA问题是在多线程并发的情况下，发生的一种现象。上一次记录了有关CAS操作的一些知识，CAS通过比较内存中的一个数据是否是预期值，如果是就将它修改成新值，如果不是则进行自旋，重复比较的操作，直到某一刻内存值等于预期值再进行修改。而ABA问题则是在CAS操作中存在的一个经典问题，这个问题某些时候不会带来任何影响，某些时候却是影响很大的。

## 二.什么是ABA问题？

#### 理解一：

​		当执行campare and swap会出现失败的情况。例如，一个线程先读取共享内存数据值A，随后因某种原因，线程暂时挂起，同时另一个线程临时将共享内存数据值先改为B，随后又改回为A。随后挂起线程恢复，并通过CAS比较，最终比较结果将会无变化。这样会通过检查，这就是ABA问题。 在CAS比较前会读取原始数据，随后进行原子CAS操作。这个间隙之间由于并发操作，最终可能会带来问题。

#### **理解二:**

![](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/image-20181231131658183.png)

“ABA”问题：假设t1线程工作时间为10秒，t2线程工作时间为2秒，那么可能在A的工作期间，主内存中的共享变量 A已经被t2线程修改了多次，只是恰好最后一次修改的值是该变量的初始值，虽然用CAS判定出来的结果是期望值，但是却不是原来那个了=======》“狸猫换太子”
相当于是只关心共享变量的起始值和结束值，而不关心过程中共享变量是否被其他线程动过。
有些业务可能不需要关心中间过程，只要前后值一样就行，但是有些业务需求要求变量在中间过程不能被修改。

只靠CAS无法保证ABA问题，需要使用“原子引用”才能解决！！！！

# 三.ABA问题的解决：

## 原子引用：（存在ABA问题）

案例：

```java
 package InterviewTest;

import java.util.concurrent.atomic.AtomicReference;

class User{
	 String name;
	 int age;
	 
	 public User(String name,int age) {
		 this.name=name;
		 this.age=age;
	 }

	@Override
	public String toString() {
		return "User [name=" + name + ", age=" + age + "]";
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	public int getAge() {
		return age;
	}

	public void setAge(int age) {
		this.age = age;
	}
 }
public class AtomicReferenceDemo {
	public static void main(String[] args) {
		User z3 = new User("z3",25);
		User li4 = new User("li4",25);
		AtomicReference<User> atomicReference  = new AtomicReference<>();
		atomicReference.set(z3);
		System.out.println(atomicReference);
		System.out.println(atomicReference.compareAndSet(z3, li4)+
							"       "+atomicReference.get().toString());
		System.out.println(atomicReference.compareAndSet(li4, z3)+
				"       "+atomicReference.get().toString());
	}
}
```

## 带版本号的原子引用（解决ABA问题）

**AtomicStampedReference版本号原子引用：**
**案例：两种原子引用的对比**

```java

package InterviewTest;

import java.util.concurrent.atomic.AtomicReference;
import java.util.concurrent.atomic.AtomicStampedReference;

public class ABADemo {
	
	
	static AtomicReference<Integer> atomicReference 
									= new AtomicReference<>(100);
	static AtomicStampedReference<Integer>  atomicStampedReference 
									= new AtomicStampedReference<>(100,1);
	
	
	public static void main(String[] args) {
		
		System.out.println("************以下是ABA问题的产生**************");
		new Thread(()->{
			atomicReference.compareAndSet(100, 101);
			atomicReference.compareAndSet(101, 100);
		},"t1").start();
		
		new Thread(()->{
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			
			System.out.println(atomicReference.compareAndSet(100, 2019)
					+"   "+atomicReference.get());
		},"t2").start();
		
		
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		
		System.out.println("************以下是ABA问题的解决**************");
		
		new Thread(()->{
			int stamp = atomicStampedReference.getStamp();
			System.out.println(Thread.currentThread().getName()
					+"  "+"   第一次版本号："+stamp);
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			
			atomicStampedReference.compareAndSet(100, 
										101, 
										atomicStampedReference.getStamp(),
										atomicStampedReference.getStamp()+1);
			System.out.println(Thread.currentThread().getName()
					+"  "+"   第2次版本号："+atomicStampedReference.getStamp());
			atomicStampedReference.compareAndSet(101, 
					100, 
					atomicStampedReference.getStamp(),
					atomicStampedReference.getStamp()+1);
			System.out.println(Thread.currentThread().getName()
					+"  "+"   第3次版本号："+atomicStampedReference.getStamp());
			
		},"t3").start();
		
		new Thread(()->{
			int stamp = atomicStampedReference.getStamp();
			System.out.println(Thread.currentThread().getName()
					+"  "+"   第一次版本号："+stamp);
			try {
				Thread.sleep(3000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			
			boolean result =  atomicStampedReference.compareAndSet(
					100, 
					2019, 
					stamp, 
					stamp+1);
			System.out.println(Thread.currentThread().getName()+
					"  修改成功否："+result+"  当前最新实际版本号："
					+atomicStampedReference.getStamp());
			System.out.println(Thread.currentThread().getName()+
					"  当前实际最新值："
					+atomicStampedReference.getReference());
			
		},"t4").start();
	}

}

输出:
************以下是ABA问题的产生**************
true   2019
************以下是ABA问题的解决**************
t3     第一次版本号：1
t4     第一次版本号：1
t3     第2次版本号：2
t3     第3次版本号：3
t4  修改成功否：false  当前最新实际版本号：3
t4  当前实际最新值：100
```

## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
