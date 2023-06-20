import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
  "/zh/",
  // "/demo/",
  {
    text: "Selected Blogs",
    icon: "pen-to-square",
    prefix: "/zh/posts/",
    children: [
      {
        text: "数据结构",
        icon: "pen-to-square",
        prefix: "数据结构/",
        children: [
          { text: "手写ArrayList", icon: "pen-to-square", link: "【数据结构】手写实现ArrayList.html" },
          { text: "手写LinkedList", icon: "pen-to-square", link: "【数据结构】手写实现LinkedList.html" },
          { text: "手写Map", icon: "pen-to-square", link: "【数据结构】手写实现Map.html" },
        ],
      },
      {
        text: "Flutter",
        icon: "pen-to-square", 
        prefix: "Flutter/",
        children: [
          {
            text: "Flutter全网最全学习文档！",
            icon: "pen-to-square",
            link: "【Flutter】Flutter文档.html",
          },
          {
            text: "用Flutter和Java开发一个抽奖APP~",
            icon: "pen-to-square",
            link: "【Flutter】用Flutter和Java来开发一个抽奖APP.html",
          },
        ],
      },
      {
        text: "公众号系列",
        icon: "pen-to-square",
        prefix: "公众号开发专栏/",
        children: [
          {
            text: "一、公众号如何发送模板消息？",
            icon: "pen-to-square",
            link: "【公众号开发】公众号技术分享第一期-如何注册微信公众平台并使用公众号模板消息.html",
          },
          {
            text: "二、模板模式优雅的推送模板消息！",
            icon: "pen-to-square",
            link: "【公众号开发】公众号技术分享第二期-公众号模板消息-模板模式实战分享.html",
          },  {
            text: "三、公众号事件处理实战！",
            icon: "pen-to-square",
            link: "【公众号开发】公众号技术分享第三期-公众号事件处理-设计模式实战分享.html",
          },
        ],
      },
    ],
  },
  {
    text: "Brath的Github",
    icon: "book",
    link: "https://github.com/Guoqing815",
  },
]);

