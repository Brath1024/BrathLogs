---
date: 2021-07-09 02:53:41

title: 【Flutter】Flutter修复Android 12无法构建的问题，自动适配 exported 深入解析避坑.md
---

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E6%89%AB%E7%A0%81_%E6%90%9C%E7%B4%A2%E8%81%94%E5%90%88%E4%BC%A0%E6%92%AD%E6%A0%B7%E5%BC%8F-%E6%A0%87%E5%87%86%E8%89%B2%E7%89%88.png)



# 【Flutter】Flutter修复Android 12无法构建的问题，自动适配 exported 深入解析避坑



>*【摘要】 众所周知，从 Android 12 开始，使用了 TargetSDK 31 之后，四大组件如果使用了 intent-filter， 但是没显性质配置 exported App 将会无法安装，甚至编译不通过...*

> 比如启动的 `Activity` 就需要设置 `exported` 为 `true` ，至于其他组件是否设置为 `true` 则看它是否需要被其它应用调用。

#### 然而这个事情的状态是这样的:

- 如果出现问题的 `AndroidManifest` 文件是你本地的，那手动修改即可;
- 但如果出现问题的是第三方远程依赖，并且对方并没有提供源码和更新，你就无法直接修改；
- 如果第三方依赖太多，查找哪些出了问题十分费时费力。

## 脚本

所以在之前的 《Android 12 快速适配要点》 一文中提供了一套脚本，专门用于适配 Android 12 下缺少 `android:exported` 无法编译或者安装的问题，但是在这期间收到了不少问题反馈：

### com.android.tools.build:gradle:4.0.0 以及其下版本

一下脚本经过测试最高可到支持的版本： **gradle:4.0.0 & gradle-6.1.1-all.zip**

```gradle
/**
 * 修改 Android 12 因为 exported 的构建问题
 */
android.applicationVariants.all { variant ->
    variant.outputs.all { output ->
        output.processResources.doFirst { pm ->
            String manifestPath = output.processResources.manifestFile
            def manifestFile = new File(manifestPath)
            def xml = new XmlParser(false, true).parse(manifestFile)
            def exportedTag = "android:exported"
            ///指定 space
            def androidSpace = new groovy.xml.Namespace('http://schemas.android.com/apk/res/android', 'android')

            def nodes = xml.application[0].'*'.findAll {
                //挑选要修改的节点，没有指定的 exported 的才需要增加
                (it.name() == 'activity' || it.name() == 'receiver' || it.name() == 'service') && it.attribute(androidSpace.exported) == null

            }
            ///添加 exported，默认 false
            nodes.each {
                def isMain = false
                it.each {
                    if (it.name() == "intent-filter") {
                        it.each {
                            if (it.name() == "action") {
                                if (it.attributes().get(androidSpace.name) == "android.intent.action.MAIN") {
                                    isMain = true
                                    println("......................MAIN FOUND......................")
                                }
                            }
                        }
                    }
                }
                it.attributes().put(exportedTag, "${isMain}")
            }

            PrintWriter pw = new PrintWriter(manifestFile)
            pw.write(groovy.xml.XmlUtil.serialize(xml))
            pw.close()
        }
    }

}
```

### com.android.tools.build:gradle:4.0.0 以上版本

以下脚本经过测试支持的版本： **gradle:4.1.0 & gradle-6.5.1-all.zip**

```gradle
/**
 * 修改 Android 12 因为 exported 的构建问题
 */

android.applicationVariants.all { variant ->
    variant.outputs.each { output ->
        def processManifest = output.getProcessManifestProvider().get()
        processManifest.doLast { task ->
            def outputDir = task.multiApkManifestOutputDirectory
            File outputDirectory
            if (outputDir instanceof File) {
                outputDirectory = outputDir
            } else {
                outputDirectory = outputDir.get().asFile
            }
            File manifestOutFile = file("$outputDirectory/AndroidManifest.xml")
            println("----------- ${manifestOutFile} ----------- ")

            if (manifestOutFile.exists() && manifestOutFile.canRead() && manifestOutFile.canWrite()) {
                def manifestFile = manifestOutFile
                ///这里第二个参数是 false ，所以 namespace 是展开的，所以下面不能用 androidSpace，而是用 nameTag
                def xml = new XmlParser(false, false).parse(manifestFile)
                def exportedTag = "android:exported"
                def nameTag = "android:name"
                ///指定 space
                //def androidSpace = new groovy.xml.Namespace('http://schemas.android.com/apk/res/android', 'android')

                def nodes = xml.application[0].'*'.findAll {
                    //挑选要修改的节点，没有指定的 exported 的才需要增加
                    //如果 exportedTag 拿不到可以尝试 it.attribute(androidSpace.exported)
                    (it.name() == 'activity' || it.name() == 'receiver' || it.name() == 'service') && it.attribute(exportedTag) == null

                }
                ///添加 exported，默认 false
                nodes.each {
                    def isMain = false
                    it.each {
                        if (it.name() == "intent-filter") {
                            it.each {
                                if (it.name() == "action") {
                                    //如果 nameTag 拿不到可以尝试 it.attribute(androidSpace.name)
                                    if (it.attributes().get(nameTag) == "android.intent.action.MAIN") {
                                        isMain = true
                                        println("......................MAIN FOUND......................")
                                    }
                                }
                            }
                        }
                    }
                    it.attributes().put(exportedTag, "${isMain}")
                }

                PrintWriter pw = new PrintWriter(manifestFile)
                pw.write(groovy.xml.XmlUtil.serialize(xml))
                pw.close()

            }

        }
    }
}
```

这段脚本你可以直接放到 `app/build.gradle` 下执行，也可以单独放到一个 gradle 文件之后 `apply` 引入，它的作用就是：

> 在打包过程中检索所有没有设置 `exported` 的组件，给他们动态配置上 `exported`，这里有个特殊需要注意的是，因为启动 `Activity` 默认就是需要被 Launcher 打开的，所以 `"android.intent.action.MAIN"` 需要 `exported` 设置为 `true` 。（**PS：更正规应该是用 LAUNCHER 类别，这里故意用 MAIN**）

而后综合问题，具体反馈的问题有 ：

- `label`直接写死中文，不是引用 `@string` 导致的在 3.x 的版本可以正常运行，但不能打包 ；
- `XmlParser` 类找不到，这个首先确定 AGP 版本和 Gradle 版本是否匹配，具体可见 gradle-plugin，另外可以通过 **`groovy.util.XmlParser`** 或者 **`groovy.xml.XmlParser`** 全路径指定使用 ，如果是 gradle 文件里显示红色并不会影响运行;
- **运行报错提示 `android:exported needs`，这个就是今天需要输入聊的**；

```javascript
Error: android:exported needs to be explicitly specified for <xxxx>. Apps targeting Android 12 and higher are required to specify an explicit value for `android:exported` when the corresponding component has an intent filter defined.

  
 
```

基于上述脚本测试和反馈，目前的结论是：

> **从 `gradle:4.2.0 & gradle-6.7.1-all.zip` 开始，TargetSDK 31 下脚本会有异常，因为在 `processDebugMainManifest` （带有Main） 的阶段，会直接扫描依赖库的 `AndroidManifest.xml` 然后抛出直接报错，从而进不去 `processDebugManifest` 任务阶段就编译停止，所以实际上脚本并没有成功运行**。

所以此时拿不到 `mergerd_manifest` 下的文件，因为 `mergerd_manifest` 下 `AndroidManifest.xml` 也还没创建成功，没办法进入 task ，也就是该脚本目前只能针对 `gradle:4.1.0` 以及其下版本安装 apk 到 Android12 的机器上， 有 `intent-filter` 但没有 exoprted 的适配问题，**基于这个问题，不知道各位是否有什么好的建议？**

## 新脚本

而目前基于这个问题，这里提供了如下脚本，在 `gradle:4.2.0 & gradle-6.7.1-all.zip` 以及 `7.0` 的版本上，**该脚本的作用是在运行时自动帮你打印出现问题的 aar 包依赖路径和组建名称**：

```gradle
android.applicationVariants.all { variant ->
    variant.outputs.each { output ->
        //println("=============== ${variant.getBuildType().name.toUpperCase()} ===============")
        //println("=============== ${variant.getFlavorName()} ===============")
        def vn
        if (variant.getFlavorName() != null && variant.getFlavorName() != "") {
            vn = variant.name;
        } else {
            if (variant.getBuildType().name == "release") {
                vn = "Release"
            } else {
                vn = "Debug"
            }
        }
        def taskName = "process${vn}MainManifest";
        try {
            println("=============== taskName ${taskName} ===============")
            project.getTasks().getByName(taskName)
        } catch (Exception e) {
            return
        }
        ///你的自定义名字
        project.getTasks().getByName(taskName).doFirst {
            //def method = it.getClass().getMethods()
            it.getManifests().getFiles().each {
                if (it.exists() && it.canRead()) {
                    def manifestFile = it
                    def exportedTag = "android:exported"
                    def nameTag = "android:name"
                    ///这里第二个参数是 false ，所以 namespace 是展开的，所以下面不能用 androidSpace，而是用 nameTag
                    def xml = new XmlParser(false, false).parse(manifestFile)
                    if (xml.application != null && xml.application.size() > 0) {
                        def nodes = xml.application[0].'*'.findAll {
                            //挑选要修改的节点，没有指定的 exported 的才需要增加
                            //如果 exportedTag 拿不到可以尝试 it.attribute(androidSpace.exported)
                            (it.name() == 'activity' || it.name() == 'receiver' || it.name() == 'service') && it.attribute(exportedTag) == null

                        }
                        if (nodes.application != null && nodes.application.size() > 0) {
                            nodes.each {
                                def t = it
                                it.each {
                                    if (it.name() == "intent-filter") {
                                        println("$manifestFile \n .....................${t.attributes().get(nameTag)}......................")
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

  
 
```

如下图所示，**因为目前官方如红色信息内容其实指向并不正确，容易误导问题方向，所以通过上述脚本打印，可以快速查找到问题所在的点，然后通过 `tool:replace` 临时解决**。

![img](https://img-blog.csdnimg.cn/img_convert/95c73f26b50f1880f6e8a6548ecbdd7a.png)

具体为什么之前的脚本在高版本 AGP 下无法使用，原因在于新版本在 `processDebugMainManifest` ，或者说 `processXXXXXXMainManifest` 的处理逻辑发生了变化，通过找到 `processDebugMainManifest` 的实现类，可以看到问题出现就是在于 `Merging library manifest` 。

> `processDebugMainManifest` 的实现在 ProcessApplicationManifest 里，对应路径是 ProcessApplicationManifest -> MainfestHelper mergeManifestsForApplication -> MainfestMerger2

错误是在 `Merging library manifest` 的阶段出现异常，但是这个阶段的 task 里对于第三方依赖路径的输入，主要是从 `private fun computeFullProviderList` 方法开始，所以输入到 `mergeManifestsForApplication` 里的第三方路径是通过这个私有方法生成。

![img](https://img-blog.csdnimg.cn/img_convert/5e0802f3e6ebb8d98de0b09c9603bbe4.png)

感觉唯一可以考虑操作的就是内部的 `manifests` 对象去变换路径，但是它是 `private` ，并且内部并不能很好复写其内容。

![img](https://img-blog.csdnimg.cn/img_convert/1b2cad1e51fd633a56c64c106219d76a.png)

**另外因为 aar 文件里的 `AndroidManifset` 是 readOnly ，所以如果真的要修改，感觉只能在输入之前读取到对应 `AndroidManifset`， 并生成临时文件，在 `manifests` 对象中更改其路径来完成**，不知道大家有没有什么比较好的思路 。

> 如果有好的解决办法，后续再更新。

## 最后

最后再说一个坑 ，如果你是低版本 Gradle 可以打包成功，但是运行到 Android12 机器的时候，可能会因为没有 exported 遇到安装失败的问题：

1、如果是模拟器 12，你可能会看到如下所示的错误提示 ，提示上显示还是很直观的， 直接告诉你是 `android:exported` 的问题：

```javascript
* What went wrong:
Execution failed for task ':app:installDebug'.
> java.util.concurrent.ExecutionException: com.android.builder.testing.api.DeviceException: com.android.ddmlib.InstallException: INSTALL_PARSE_FAILED_MANIFEST_MALFORMED: Failed parse during installPackageLI: /data/app/vmdl487461761.tmp/base.apk (at Binary XML file line #358): xxxxx.Activity: Targeting S+ (version 31 and above) requires that an explicit value for android:exported be defined when intent filters are present

  
 
```

2、如果你是真机 12，那可能就是这样的提示，提示然是 `INSTALL_FAILED_USER_RESTRICTED` ，**不得不说小米系统这个安装失败很具误导性，比如 minSDK 太高导致无法安装，在小米上也会是 `INSTALL_FAILED_USER_RESTRICTED`**：

![img](https://img-blog.csdnimg.cn/img_convert/30ac3d45bb59a0a966036244d82bfc56.png)

基本上内容就这些，具体如何进一步优化还待后续测试， **所以针对脚本实现，你还有什么问题或者想法，欢迎评论交流 ～**

文章来源: carguo.blog.csdn.net，作者：恋猫de小郭，版权归原作者所有，如需转载，请联系作者。

原文链接：carguo.blog.csdn.net/article/details/123438734
## 关于我

Brath是一个热爱技术的Java程序猿，公众号「InterviewCoder」定期分享有趣有料的精品原创文章！

![InterviewCoder](https://brath4.oss-cn-shenzhen.aliyuncs.com/picgo/%E4%BA%8C%E7%BB%B4%E7%A0%81plus.png)

非常感谢各位人才能看到这里，原创不易，文章如果有帮助可以关注、点赞、分享或评论，这都是对我的莫大支持！
