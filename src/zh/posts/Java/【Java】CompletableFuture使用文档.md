---
date: 2022-01-12 08:06:17

title: CompletableFuture使用文档
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)





背景：
CompletableFuture字面翻译过来，就是“可完成的Future”。同传统的Future相比较，CompletableFuture能够主动设置计算的结果值（主动终结计算过程，即completable），从而在某些场景下主动结束阻塞等待。而Future由于不能主动设置计算结果值，一旦调用get()进行阻塞等待，要么当计算结果产生，要么超时，才会返回。

CompletableFuture说白了其实就是为了解决Future的问题（阻塞），而生！！！

下面总结CompletableFuture的常用api

1. 创建CompletableFuture
    实例方法：

       //实例方法
       CompletableFuture<String> completableFutureOne = new CompletableFuture<>();
       Supplier<?> task=new Supplier<Object>() {
           @Override
           public Object get() {
               return null;
           }
       };
       CompletableFuture<?> completableFuture = completableFutureOne.supplyAsync(task);
    静态方法：

  public static void main(String[] args) throws ExecutionException, InterruptedException {
          Runnable runnable = () ->
                  System.out.println("执行无返回结果的异步任务");
          System.out.println(CompletableFuture.runAsync(runnable).get());

          CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
              System.out.println("执行有返回值的异步任务");
              return "Hello World";
          });
          String result = future.get();
          System.out.println(result);
      }
  ## 2、whenComplete-第一个任务结束，对其结果处理(handly的作用一样)

  结果处理就是当future任务完成时，对任务的结果做处理工作！或异常情况处理！

  ```
  public static void main(String[] args) throws ExecutionException, InterruptedException {
          CompletableFuture<Integer> future = CompletableFuture.supplyAsync(() -> {
              try {
                  TimeUnit.SECONDS.sleep(1);
              } catch (InterruptedException e) {
  
              }
              System.out.println("执行结束1！");
              return 5;
          });
          future.whenComplete(new BiConsumer<Integer, Throwable>() {
              @Override
              public void accept(Integer t, Throwable action) {
                  t=t+1;
  //                int i = 12 / 0;
                  System.out.println("执行完成2！"+action.getMessage());
              }
          })
          .exceptionally(new Function<Throwable, Integer>() {
              @Override
              public Integer apply(Throwable t) {
                  System.out.println("执行失败3：" + t.getMessage());
                  return null;
              }
          }).join();
          Integer integer = future.get();
          System.out.println("=>integer"+integer);
      }
  
  ```

  1、whenComplete只是对任务运行结束后，拿到任务结果，做个处理，并且如果任务执行有异常，会监听到异常！
  2、如果whenComplete本身有异常，那么需要单独加exceptionally来监听异常！
  3、最终future.get()拿到的还是任务1的结果
  4、如果任务有异常，future.get()拿到会抛出异常！

  ```
  执行结束1！
  执行失败3：java.lang.ArithmeticException: / by zero
  Exception in thread "main" java.util.concurrent.ExecutionException: java.lang.ArithmeticException: / by zero
  	at java.util.concurrent.CompletableFuture.reportGet(CompletableFuture.java:357)
  	at java.util.concurrent.CompletableFuture.get(CompletableFuture.java:1895)
  	at top.lisicheng.wmd.CompleableFutureTest2.main(CompleableFutureTest2.java:83)
  Caused by: java.lang.ArithmeticException: / by zero
  	at top.lisicheng.wmd.CompleableFutureTest2.lambda$main$0(CompleableFutureTest2.java:65)
  	at java.util.concurrent.CompletableFuture$AsyncSupply.run$$$capture(CompletableFuture.java:1590)
  	at java.util.concurrent.CompletableFuture$AsyncSupply.run(CompletableFuture.java)
  	at java.util.concurrent.CompletableFuture$AsyncSupply.exec(CompletableFuture.java:1582)
  	at java.util.concurrent.ForkJoinTask.doExec(ForkJoinTask.java:289)
  	at java.util.concurrent.ForkJoinPool$WorkQueue.runTask(ForkJoinPool.java:1056)
  	at java.util.concurrent.ForkJoinPool.runWorker(ForkJoinPool.java:1692)
  	at java.util.concurrent.ForkJoinWorkerThread.run(ForkJoinWorkerThread.java:157)
  
  ```

  ## 3、thenApply-第一个任务结束，可能还有第二、第三个任务，且后面一个任务，需要用到前面任务的返回值

  ```
  public static void test4(String[] args) throws ExecutionException, InterruptedException {
          /**
           * public <U> CompletableFuture<U> thenApply(Function<? super T,? extends U> fn)
           * public <U> CompletableFuture<U> thenApplyAsync(Function<? super T,? extends U> fn)
           * public <U> CompletableFuture<U> thenApplyAsync(Function<? super T,? extends U> fn, Executor executor)
           *  总结：thenApply 接收一个函数作为参数，使用该函数处理上一个CompletableFuture 调用的结果，
           *  并返回一个具有处理结果的Future对象。
           *
           */
          CompletableFuture<Integer> future = CompletableFuture.supplyAsync(() -> {
              int result = 100;
              System.out.println("一阶段：" + result);
              return result;
          }).thenApply(number -> {
              int result = number * 3;
              System.out.println("二阶段：" + result);
              return result;
          }).thenApply(number -> {
              int result = number * 3;
              System.out.println("三阶段：" + result);
              return result;
          });
  
          System.out.println("最终结果：" + future.get());
  
      }
  ```

  ## 4、thenCompose-跟上面一样的作用：

  thenCompose 的参数为一个返回 CompletableFuture 实例的函数，该函数的参数是先前计算步骤的结果。

  ```
  public <U> CompletableFuture<U> thenCompose(Function<? super T, ? extends CompletionStage<U>> fn);
  public <U> CompletableFuture<U> thenComposeAsync(Function<? super T, ? extends CompletionStage<U>> fn) ;
  public <U> CompletableFuture<U> thenComposeAsync(Function<? super T, ? extends CompletionStage<U>> fn, Executor executor) ;
  ```

  ```
  
  
  public static void main(String[] args) throws InterruptedException, ExecutionException {
      CompletableFuture<Integer> future = CompletableFuture.supplyAsync(new Supplier<Integer>() {
          @Override
          public Integer get() {
              int number = new Random().nextInt(3);
              System.out.println("第一阶段：" + number);
              return number;
          }
      }).thenCompose(new Function<Integer, CompletionStage<Integer>>() {
          @Override
          public CompletionStage<Integer> apply(Integer param) {
              return CompletableFuture.supplyAsync(new Supplier<Integer>() {
                  @Override
                  public Integer get() {
                      int number = param * 2;
                      System.out.println("第二阶段：" + number);
                      return number;
                  }
              });
          }
      });
      System.out.println("最终结果: " + future.get());
  }
  ```

  ```
  那么 thenApply 和 thenCompose 有何区别呢：
  
  thenApply 转换的是泛型中的类型，返回的是同一个CompletableFuture；
  thenCompose 将内部的 CompletableFuture 调用展开来并使用上一个CompletableFutre 调用的结果在下一步的 CompletableFuture 调用中进行运算，
  是生成一个新的CompletableFuture。
  ```

**下面用一个例子对对比：**

```
public static void main(String[] args) throws InterruptedException, ExecutionException {
    CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> "Hello");

    CompletableFuture<String> result1 = future.thenApply(param -> param + " World");
    CompletableFuture<String> result2 = future.thenCompose(param -> CompletableFuture.supplyAsync(() -> param + " World"));

    System.out.println(result1.get());
    System.out.println(result2.get());
}
```

## 5、结果消费

```
thenAccept系列：对单个结果进行消费
thenAcceptBoth系列：对两个结果进行消费
thenRun系列：不关心结果，只对结果执行Action
```

只会拿到上个任务的值，然后对值进行消费，但是绝对不会产生新的值
这是跟上面任务中间 转换的，最大的区别

消费结果还包括thenRun
thenRun跟thenAccept的区别是，它不仅不产生新的值，还不消费上个任务的值，只是自己做一个业务处理。

6、结果组合
thenCombine -合并两个线程任务的结果，并进一步处理。
applyToEither-两个线程任务相比较，先获得执行结果的，就对该结果进行下一步的转化操作。
acceptEither-两个线程任务相比较，先获得执行结果的，就对该结果进行下一步的消费操作。
runAfterEither-两个线程任务相比较，有任何一个执行完成，就进行下一步操作，不关心运行结果。
runAfterBoth-两个线程任务相比较，两个全部执行完成，才进行下一步操作，不关心运行结果。
anyOf-anyOf 方法的参数是多个给定的 CompletableFuture，当其中的任何一个完成时，方法返回这个 CompletableFuture。
allOf-allOf方法用来实现多 CompletableFuture 的同时返回。



代码实例

```
@RestController
@RequestMapping("/test")
public class TestController {

    public static ExecutorService threadPool =
            new ThreadPoolExecutor(
                    10,
                    40,
                    20,
                    TimeUnit.SECONDS,
                    new ArrayBlockingQueue<Runnable>(
                            16
                    ));

    /**
     * CompletableFuture 测试
     *
     * @return
     */
    @ApiOperation("CompletableFuture 测试")
    @PostMapping("test")
    public Object test() {
        Map<Object, Object> result = new HashMap<>();
        CompletableFuture.allOf(
                CompletableFuture.runAsync(() -> {
                    System.out.println("执行1");
                    result.put("key1", seslectData1());
                }, threadPool),
                CompletableFuture.runAsync(() -> {
                    System.out.println("执行2");
                    result.put("key2", seslectData2());
                }, threadPool),
                CompletableFuture.runAsync(() -> {
                    System.out.println("执行3");
                    result.put("key3", seslectData3());
                }, threadPool)
        ).join();

        return ResponseUtil.ok(result);
    }

    public String seslectData1() {
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return "key1";
    }

    public String seslectData2() {
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return "key2";
    }

    public String seslectData3() {
        try {
            Thread.sleep(300);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return "key3";
    }
}
```



## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
