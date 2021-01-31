#### Dubbo SPI 机制中的Adpative原理
`getAdaptiveExtension()`方法是ExtensionLoader类提供的，主要是获取扩展点，下面是该方法具体实现细节
```java
 public T getAdaptiveExtension() {
        Object instance = cachedAdaptiveInstance.get();
        if (instance == null) {
            if (createAdaptiveInstanceError == null) {
                synchronized (cachedAdaptiveInstance) {
                    instance = cachedAdaptiveInstance.get();
                    if (instance == null) {
                        try {
                            //获取创建Adaptive扩展点的实例
                            instance = createAdaptiveExtension();
                            //然后把它放到cachedAdaptiveInstance中
                            cachedAdaptiveInstance.set(instance);
                        } catch (Throwable t) {
                            createAdaptiveInstanceError = t;
                            throw new IllegalStateException("fail to create adaptive instance: " + t.toString(), t);
                        }
                    }
                }
            } else {
                throw new IllegalStateException("fail to create adaptive instance: " + createAdaptiveInstanceError.toString(), createAdaptiveInstanceError);
            }
        }
        return (T) instance;
    }
```
