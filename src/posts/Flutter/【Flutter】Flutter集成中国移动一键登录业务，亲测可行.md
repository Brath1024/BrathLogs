---
date: 2023-01-21 18:15:28

title: Flutter集成中国移动一键登录业务
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# Flutter集成中国移动一键登录业务

#本文适用于 Flutter平台开发的小伙伴需要所谓一键登录的业务

![https://img.mukewang.com/szimg/5e3fda1b08fe88e203600780.jpg](https://img.mukewang.com/szimg/5e3fda1b28fe88e205001000.jpg)

先贴上链接

中国移动互联网能力开放平台：https://dev.10086.cn

号码认证Android_5.9.5接入文档：http://dev.10086.cn/dev10086/pub/loadAttach?attachId=9324E5A5EB8E4DF5BC5118221A93D3ED

移动认证服务端接入文档：https://dev.10086.cn/dev10086/pub/loadAttach?attachId=6EF75FD09D4F40D1973CB7C36C3DB2E2



话不多说，直接上正题，本文比某SDN的质量高不知道多少倍呢。

### 1.准备工作

#### 1.1注册账号并创建一个应用

​	![image-20230112193829020](C:/Users/Administrator/AppData/Roaming/Typora/typora-user-images/image-20230112193829020.png)

#### 1.2 下载好统一认证SDK，这里使用的版本是 quick_login_android_5.9.5.jar

请求我的服务器下载：http://43.143.40.221:8080/quick_login_android_5.9.5.rar
下载好后解压

![image-20230112194426269](C:/Users/Administrator/AppData/Roaming/Typora/typora-user-images/image-20230112194426269.png)

#### 1.3 在移动开发平台申请好应用拿到appid、appkey

![image-20230112193937792](C:/Users/Administrator/AppData/Roaming/Typora/typora-user-images/image-20230112193937792.png)



### 2.开始接入

#### 2.1 使用AS打开你的项目，新建lib文件夹，导入quick_login_android_5.9.5.jar ，右键asLibirary，导入库

![image-20230112194530336](C:/Users/Administrator/AppData/Roaming/Typora/typora-user-images/image-20230112194530336.png)

打开项目视图

![image-20230112194611295](C:/Users/Administrator/AppData/Roaming/Typora/typora-user-images/image-20230112194611295.png)

点击APP栏位，出现quick_login_android_5.9.5.jar即可

![image-20230112194628573](C:/Users/Administrator/AppData/Roaming/Typora/typora-user-images/image-20230112194628573.png)

#### 2.2 在app级别下的 build.gradle 中的 dependencies 栏位导入依赖，使用相对路径引入即可

```
dependencies {
    ···
    implementation files('..\\lib\\quick_login_android_5.9.5.jar')
}
```

![image-20230112194743574](C:/Users/Administrator/AppData/Roaming/Typora/typora-user-images/image-20230112194743574.png)



#### 2.3 打开 AndroidManifest.xml 在application引入 android:networkSecurityConfig="@xml/network_security_config"

![image-20230112194847830](C:/Users/Administrator/AppData/Roaming/Typora/typora-user-images/image-20230112194847830.png)

同时，在res目录下新建一个xml目录

新建network_security_config.xml文件 引入以下代码

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true" />
</network-security-config>
```

![image-20230112195214620](C:/Users/Administrator/AppData/Roaming/Typora/typora-user-images/image-20230112195214620.png)

下一步、将 SDK集成的 GenLoginAuthActivity 引入主文件

```xml
 <activity
          android:name="com.cmic.gen.sdk.view.GenLoginAuthActivity"
          android:configChanges="orientation|keyboardHidden|screenSize"
          android:screenOrientation="unspecified"
          android:theme="@style/AuthPage"
          android:launchMode="singleTop">
 </activity>
```

![image-20230112195050430](C:/Users/Administrator/AppData/Roaming/Typora/typora-user-images/image-20230112195050430.png)

同时，在 res 目录下的两个values文件中的styles.xml中引入代码：（两个都需要引入）

```xml
    <style name="AuthPage" parent="@android:style/Theme.Holo.Light.NoActionBar">
        <item name="android:background">@null</item>
        <item name="android:colorBackground">@null</item>
        <item name="android:windowIsTranslucent">true</item>
    </style>
```

![image-20230112194947904](C:/Users/Administrator/AppData/Roaming/Typora/typora-user-images/image-20230112194947904.png)

下一步、引入权限代码：

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.CHANGE_NETWORK_STATE" />
```

![image-20230112195305682](C:/Users/Administrator/AppData/Roaming/Typora/typora-user-images/image-20230112195305682.png)

至此、主文件配置完成！

#### 2.4 将上面压缩包文件中SDK提供的Demo程序中的res-umc文件目录引入到我们的main目录中，与res同级

![image-20230112195514010](C:/Users/Administrator/AppData/Roaming/Typora/typora-user-images/image-20230112195514010.png)

将res-umc目录下的文件复制进入res

![image-20230112195543408](C:/Users/Administrator/AppData/Roaming/Typora/typora-user-images/image-20230112195543408.png)

最终效果：

![image-20230112195605424](C:/Users/Administrator/AppData/Roaming/Typora/typora-user-images/image-20230112195605424.png)

![image-20230112195619339](C:/Users/Administrator/AppData/Roaming/Typora/typora-user-images/image-20230112195619339.png)

#### 2.5 打开 kotlin 下的 MainActivity.kt ，将代码全部复制进入，如果导不到包可以看看你的Jar包有没有成功引入

```
package com.example.mobiledemo

import android.os.Bundle
import android.widget.Toast
import com.cmic.gen.sdk.auth.GenAuthnHelper
import com.cmic.gen.sdk.auth.GenTokenListener
import com.cmic.gen.sdk.view.GenAuthThemeConfig
import io.flutter.Log
import io.flutter.embedding.android.FlutterActivity
import io.flutter.plugin.common.MethodChannel
import io.flutter.plugins.GeneratedPluginRegistrant
import org.json.JSONObject


class MainActivity : FlutterActivity() {
    private var mHelper: GenAuthnHelper? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        MethodChannel(
            getFlutterEngine()?.getDartExecutor()?.getBinaryMessenger(),
            "TYRZ"
        ).setMethodCallHandler { methodCall, result ->
            if (methodCall.method == "loginAuth") {
                loginAuth(result)
            } else {
                Log.e("TYRZ", "notImplemented")
                result.notImplemented()
            }
        }

        //创建AuthnHelper实例
        mHelper = GenAuthnHelper.getInstance(this)
        //打开SDK日志打印开关
        GenAuthnHelper.setDebugMode(true)
        //初始化授权页主题
        mHelper?.setAuthThemeConfig(GenAuthThemeConfig.Builder().build())
        getFlutterEngine()?.let { GeneratedPluginRegistrant.registerWith(it) }
    }

    /**
     * 统一认证SDK授权方法调用
     */
    private fun loginAuth(result: MethodChannel.Result) {
        //调用授权方法，这里要填写的appid、appkey为开发者在移动开发平台申请的appid、appkey
        mHelper?.loginAuth(
            "300012327504",
            "2FDF3FA644E7476FE6733E123D968A82",
            object : GenTokenListener {
                override fun onGetTokenComplete(i: Int, jsonObject: JSONObject) {
                    try {
                        val resultCode = jsonObject.optString("resultCode", "没有返回码！")
                        Toast.makeText(this@MainActivity, resultCode, Toast.LENGTH_SHORT).show()
                        //将结果回传给flutter
                        result.success(resultCode)
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                }
            })
    }
}
```



### 3.运行调试

3.1 demo代码如下：

核心逻辑：

```
//调用方法通道 TYRZ，即我们在MainActivity中注册的方法，调用loginAuth登录方法
String result = await const MethodChannel("TYRZ").invokeMethod("loginAuth");
```

```dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key? key, this.title}) : super(key: key);

  String? title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  //调用java方法
  void loginAuth() async {
    print("按钮点击！");
    try {
      String result = await const MethodChannel("TYRZ").invokeMethod("loginAuth");
      //打印统一认证回调的响应码
      print("resultCode = " + result);
    } catch (e) {
      print(e);
    }
  }

  //创建一个按钮，在点击按钮时调用统一认证的loginAuth方法拉起授权页。
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title!),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            RaisedButton(
              child: const Text("一键登录"),
              onPressed: () {
                loginAuth();
              },
            ),
          ],
        ),
      ),
    );
  }
}

```



### 结果：成功打印

![image-20230112200118488](C:/Users/Administrator/AppData/Roaming/Typora/typora-user-images/image-20230112200118488.png)



客户端部分就此结束。



## 服务端接入认证并请求移动接口获取用户手机号：

贴上部分代码：

```java
 		String mobile;
        HashMap<String, String> res = null;
        Map<Object, Object> result = new HashMap<>();

        try {
            //获取到结果
            res = JSONObject.parseObject(post(CHINA_MOBILE_OBTAINS_MOBILE_PHONE_NUMBER, JSONObject.toJSONString(getMD5NoEncryPtionRequestParamMap(token))), HashMap.class);
            //结果集判断
            if (AssertUtil.isEmpty(res) || !res.containsKey("msisdn")) {
                logger.error("一键登录异常：{},{}", res, ResponseCode.MOBILE_LOGIN_EXCEPTION.desc());// 一键登录异常
                result.put(ResponseCode.MOBILE_LOGIN_EXCEPTION.code(), ResponseCode.MOBILE_LOGIN_EXCEPTION.desc());
                return result;
            } else {
                //获取到手机号
                mobile = res.get("msisdn");
            }
        } catch (Exception e) {
            logger.error("一键登录异常：{},{}", res, ResponseCode.MOBILE_LOGIN_EXCEPTION.desc());// 一键登录异常
            result.put(ResponseCode.MOBILE_LOGIN_EXCEPTION.code(), ResponseCode.MOBILE_LOGIN_EXCEPTION.desc());
            return result;
        }
```

MD5加密签名

```java

    /**
     * Calculates the MD5 digest and returns the value as a 32 character hex string.
     *
     * @param data Data to digest
     * @return MD5 digest as a hex string
     */
    public static String md5Hex(String data) {
        return org.apache.commons.codec.digest.DigestUtils.md5Hex(data).toUpperCase();
    }

```

获取请求集合：

```java
   /**
     * 获取MD5加密方式的无对称加密的请求集合
     *
     * @param token
     * @return
     */
    private HashMap<String, String> getMD5NoEncryPtionRequestParamMap(String token) {
        HashMap<String, String> param = new HashMap<>();
        String msgId = UserUtil.createUUID();
        String time = new SimpleDateFormat("yyyyMMddHHmmssSSS").format(new Date());
        param.put("version", "2.0");
        param.put("msgid", msgId);
        param.put("systemtime", time);
        param.put("strictcheck", "0");
        param.put("appid", appId);
        param.put("token", token);
        param.put("encryptionalgorithm", "");
        param.put("sign", md5Hex(appId + "2.0" + msgId + time + "0" + token + APPSecret));
        return param;
    }
```

post请求方法：

```java
  public static String post(String URL, String json) {
        HttpClient client = new DefaultHttpClient();
        HttpPost post = new HttpPost(URL);
        post.setHeader("Content-Type", "application/json");
        String result = "";
        try {

            StringEntity s = new StringEntity(json, "UTF-8");
            s.setContentEncoding(new BasicHeader(HTTP.CONTENT_TYPE,
                    "application/json"));
            post.setEntity(s);
            // 发送请求
            HttpResponse httpResponse = client.execute(post);
            // 获取响应输入流
            InputStream inStream = httpResponse.getEntity().getContent();
            BufferedReader reader = new BufferedReader(new InputStreamReader(
                    inStream, "utf-8"));
            StringBuilder strber = new StringBuilder();
            String line = null;
            while ((line = reader.readLine()) != null)
                strber.append(line + "\n");
            inStream.close();
            result = strber.toString();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return result;
    }
```













## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
