---
date: 2022-01-02 23:41:33

title: Java开发公众号自动回复功能
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



##### 本文最先发表于我的个人博客 ，CSDN为同步发布，如有需要，请访问 [Brath的个人博客](https://brath.top/) 获取更多内容

## 背景

最近准备搭建自己的[博客系统](https://so.csdn.net/so/search?q=博客系统&spm=1001.2101.3001.7020)，有些软件或资料的下载链接放在网盘中，为了方便下载，同时可以将用户导流到公众号上，因此准备用Java实现微信公众号业务支持公众号自动回复的功能

## 准备工作

- 微信公众号业务支持公众号

首先当然是需要注册一个[微信公众号业务支持公众号](https://so.csdn.net/so/search?q=微信公众号业务支持公众号&spm=1001.2101.3001.7020)，具体步骤就不在这里赘述了，注册地址：[微信公众号业务支持公众平台](https://mp.weixin.qq.com/)

注册完毕后需要完成认证操作

## 代码

依赖引入，**主要为xml相关依赖**， 因为微信公众号业务支持公众号采用的xml消息格式进行交互

```xml
<dependency>
  <groupId>dom4j</groupId>
  <artifactId>dom4j</artifactId>
  <version>1.6.1</version>
</dependency>
<dependency>
  <groupId>com.thoughtworks.xstream</groupId>
  <artifactId>xstream</artifactId>
  <version>1.4.19</version>
</dependency>

```

自动回复内容一共需要两个接口（两个接口路由完全一致，一个为GET请求，一个为POST请求）

- 微信公众号业务支持公众号认证接口

> 此接口用于微信公众号业务支持公众号后台服务器认证使用，GET请求

```java
    /**
     * 微信公众号业务支持校验
     *
     * @param signature
     * @param timestamp
     * @param nonce
     * @param echostr
     * @param response
     */
    @GetMapping("callback")
    public void callback(String signature, String timestamp, String nonce, String echostr, HttpServletResponse response) {
        PrintWriter out = null;
        log.info("微信公众号业务支持校验消息，signature:{}，timestamp:{}，nonce:{}，echostr:{}", signature, timestamp, nonce, echostr);
        List<WechatConfigPO> configPOList = wechatConfigDao.selectAll();
        try {
            out = response.getWriter();
            out.write(echostr);
        } catch (Throwable e) {
            log.error("微信公众号业务支持校验失败", e);
        } finally {
            if (out != null) {
                out.close();
            }
        }
    }
```

- 消息接收接口

> 此接口用于接收公众号消息回调，POST请求

```java
    /**
     * 微信公众号业务支持消息回调
     *
     * @param request
     * @param response
     */
    @PostMapping("callback")
    public void callback(HttpServletRequest request, HttpServletResponse response) {
        PrintWriter out = null;

        try {
            String respMessage = wechatService.callback(request);
            if (StringUtils.isBlank(respMessage)) {
                log.info("不回复消息");
                return;
            }
            response.setCharacterEncoding("UTF-8");
            out = response.getWriter();
            out.write(respMessage);
        } catch (Throwable e) {
            log.error("微信公众号业务支持发送消息失败", e);
        } finally {
            if (out != null) {
                out.close();
            }
        }
    }
```

**消息回复service**

```java
/**
 * @author Brath
 * @date 2023/2/23
 * @desc 微信公众号业务支持
 */
@Slf4j
@Service
public class WechatService {

    @Autowired
    private TextReplyService textReplyService;

    /**
     * 微信公众号业务支持回复
     *
     * @param request
     * @return
     * @throws UnsupportedEncodingException
     */
    public String callback(HttpServletRequest request) throws UnsupportedEncodingException {
        request.setCharacterEncoding("UTF-8");

        try {
            Map<String, String> requestMap = WechatMessageUtils.parseXml(request);
            log.info("微信公众号业务支持接收到消息:{}", GsonUtils.toJson(requestMap));
            // 消息类型
            String msgType = requestMap.get("MsgType");

            // 处理其他消息，暂时不做回复
            switch (msgType) {
                case WechatMsgTypeConstant.MESSAGE_TYPE_TEXT:
                    // 文本消息处理
                    return textReplyService.reply(requestMap);
                default:
                    return textReplyService.reply(requestMap);
            }
        } catch (Throwable e) {
            log.error("回复消息错误", e);
        }
        // 不做回复
        return null;
    }

}
```

**文本回复service**

```java
/**
 * @author Brath
 * @date 2022/5/18 9:57
 * @desc 文本回复
 */
@Service
public class TextReplyService {

    private static final String FROM_USER_NAME = "FromUserName";
    private static final String TO_USER_NAME = "ToUserName";
    private static final String CONTENT = "Content";

    @Autowired
    private WechatKeywordDao wechatKeywordDao;

    @Autowired
    private WechatMsgRecordDao wechatMsgRecordDao;

    /**
     * 自动回复文本内容
     *
     * @param requestMap
     * @return
     */
    public String reply(Map<String, String> requestMap) {
        String wechatId = requestMap.get(FROM_USER_NAME);
        String gongzhonghaoId = requestMap.get(TO_USER_NAME);

        TextMessage textMessage = WechatMessageUtils.getDefaultTextMessage(wechatId, gongzhonghaoId);

        String content = requestMap.get(CONTENT);
        if (content == null) {
            textMessage.setContent(WechatConstants.DEFAULT_MSG);
        } else {
            Example example = new Example(WechatKeywordPO.class);
            example.createCriteria().andEqualTo("wechatId", gongzhonghaoId).andEqualTo("keyword", content);
            List<WechatKeywordPO> keywordPOList = wechatKeywordDao.selectByExample(example);
            if (CollectionUtils.isEmpty(keywordPOList)) {
                textMessage.setContent(WechatConstants.DEFAULT_MSG);
            } else {
                textMessage.setContent(keywordPOList.get(0).getReplyContent());
            }
        }
        // 记录消息记录
        wechatMsgRecordDao.insertSelective(WechatMsgRecordPO.builder()
                .fromUser(wechatId)
                .wechatId(gongzhonghaoId)
                .content(content)
                .replyContent(textMessage.getContent())
                .build()
        );

        return WechatMessageUtils.textMessageToXml(textMessage);
    }

}
```

**文本消息model**

```java
/**
 * @author Brath
 * @date 2021/11/26 22:21
 * @description 文本消息
 */
@Data
public class TextMessage extends BaseMessage {

    /**
     * 回复的消息内容
     */
    private String Content;

}
1234567891011121314
```

**基础消息model**

```java
/**
 * @author Brath
 * @date 2021/11/26 22:20
 * @description 基础消息响应
 */
@Data
public class BaseMessage {

    /**
     * 接收方帐号（收到的OpenID）
     */
    private String ToUserName;
    /**
     * 开发者微信公众号业务支持号
     */
    private String FromUserName;
    /**
     * 消息创建时间 （整型）
     */
    private long CreateTime;

    /**
     * 消息类型
     */
    private String MsgType;

    /**
     * 位0x0001被标志时，星标刚收到的消息
     */
    private int FuncFlag;

}
```

**消息工具**

```java
/**
 * @author Brath
 * @date 2022/5/18 7:55
 * @desc 微信公众号业务支持消息
 */
public class WechatMessageUtils {

    /**
     * 解析微信公众号业务支持发来的请求（XML）
     *
     * @param request
     * @return
     * @throws Exception
     */
    public static Map<String, String> parseXml(HttpServletRequest request) throws Exception {
        // 将解析结果存储在HashMap中
        Map<String, String> map = new HashMap<>();

        // 从request中取得输入流
        InputStream inputStream = request.getInputStream();
        try {
            // 读取输入流
            SAXReader reader = new SAXReader();
            Document document = reader.read(inputStream);
            // 得到xml根元素
            Element root = document.getRootElement();
            // 得到根元素的所有子节点

            List<Element> elementList = root.elements();

            // 遍历所有子节点
            for (Element e : elementList) {
                map.put(e.getName(), e.getText());
            }
        } finally {
            // 释放资源
            if (inputStream != null) {
                inputStream.close();
            }
        }

        return map;
    }

    /**
     * 文本消息对象转换成xml
     *
     * @param textMessage 文本消息对象
     * @return xml
     */
    public static String textMessageToXml(TextMessage textMessage) {
        XSTREAM.alias("xml", textMessage.getClass());
        return XSTREAM.toXML(textMessage);
    }

    /**
     * 音乐消息对象转换成xml
     *
     * @param musicMessage 音乐消息对象
     * @return xml
     */
    public static String musicMessageToXml(MusicMessage musicMessage) {
        XSTREAM.alias("xml", musicMessage.getClass());
        return XSTREAM.toXML(musicMessage);
    }

    /**
     * 图文消息对象转换成xml
     *
     * @param newsMessage 图文消息对象
     * @return xml
     */
    public static String newsMessageToXml(NewsMessage newsMessage) {
        XSTREAM.alias("xml", newsMessage.getClass());
        XSTREAM.alias("item", Article.class);
        return XSTREAM.toXML(newsMessage);
    }

    /**
     * 扩展xstream，使其支持CDATA块
     */
    private static final XStream XSTREAM = new XStream(new XppDriver() {
        @Override
        public HierarchicalStreamWriter createWriter(Writer out) {
            return new PrettyPrintWriter(out) {
                // 对所有xml节点的转换都增加CDATA标记
                final boolean cdata = true;

                @Override
                protected void writeText(QuickWriter writer, String text) {
                    if (cdata) {
                        writer.write("<![CDATA[");
                        writer.write(text);
                        writer.write("]]>");
                    } else {
                        writer.write(text);
                    }
                }
            };
        }
    });

    /**
     * 获取默认文本消息
     *
     * @param receiver     接收人
     * @param officialWxid 官方微信公众号业务支持id
     * @return 文本消息
     */
    public static TextMessage getDefaultTextMessage(String receiver, String officialWxid) {
        TextMessage textMessage = new TextMessage();
        textMessage.setToUserName(receiver);
        textMessage.setFromUserName(officialWxid);
        textMessage.setCreateTime(System.currentTimeMillis());
        textMessage.setMsgType(WechatMsgTypeConstant.MESSAGE_TYPE_TEXT);
        textMessage.setFuncFlag(0);

        return textMessage;
    }

}
```

**消息类型枚举**

```java
/**
 * @author Brath
 * @date 2022/5/18 8:00
 * @desc 微信公众号业务支持消息类型
 */
public class WechatMsgTypeConstant {

    /**
     * 文本消息
     */
    public static final String MESSAGE_TYPE_TEXT = "text";

}
```

> 其他内容为一些数据库相关操作，此处不再列出，仅为：**查询关键词及其回复内容**，**存储消息记录**

## 公众号配置

- 服务器配置

公众号后台 -> 设置与开发 -> 基本配置 -> 服务器配置

![image-20230223130939844](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/image-20230223130939844.png)

- 填写服务器地址

填写你的服务器回调接口地址(**需要为公网地址，否则微信公众号业务支持无法调通**)

- 生成或者自定义你的令牌Token，后台需要配置这个Token，一定要记住

> Token 需要记住，**一般在微信公众号业务支持验证接口处会校验相关信息是否是自己的公众号**

**验证方法**

```java
    /**
 * @author Brath
 * @date 2021/11/26 21:59
 * @description 微信公众号业务支持工具
 */
@Slf4j
public class WechatUtils {

    private static final char[] HEX_DIGITS = {'0', '1', '2', '3', '4', '5',
            '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'};

    public static boolean checkSignature(String signature, String timestamp, String nonce, String token) {
        String[] str = new String[]{token, timestamp, nonce};
        //排序
        Arrays.sort(str);
        //拼接字符串
        StringBuffer buffer = new StringBuffer();
        for (int i = 0; i < str.length; i++) {
            buffer.append(str[i]);
        }
        //进
        String temp = encode(buffer.toString());
        //与微信公众号业务支持提供的signature进行匹对
        return signature.equals(temp);
    }

    private static String getFormattedText(byte[] bytes) {
        int len = bytes.length;
        StringBuilder buf = new StringBuilder(len * 2);
        for (int j = 0; j < len; j++) {
            buf.append(HEX_DIGITS[(bytes[j] >> 4) & 0x0f]);
            buf.append(HEX_DIGITS[bytes[j] & 0x0f]);
        }
        return buf.toString();
    }

    public static String encode(String str) {
        if (str == null) {
            return null;
        }
        try {
            MessageDigest messageDigest = MessageDigest.getInstance("SHA1");
            messageDigest.update(str.getBytes());
            return getFormattedText(messageDigest.digest());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
1234567891011121314151617181920212223242526272829303132333435363738394041424344454647484950
```

- 验证公众号自动回复是否正确

> 可以搜索公众号InterviewCoder)或扫码关注公众号回复关键词《chatGPT》查看效果
>
> ![二维码mini](https://brath.oss-cn-shanghai.aliyuncs.com/pigo/%E4%BA%8C%E7%BB%B4%E7%A0%81mini.png)
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
