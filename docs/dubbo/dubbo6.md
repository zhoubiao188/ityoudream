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
下面是`createAdaptiveExtension()`方法的底层实现
```java
  private T createAdaptiveExtension() {
        try {
            //得到Adaptive扩展点的类
            return injectExtension((T) getAdaptiveExtensionClass().newInstance());
        } catch (Exception e) {
            throw new IllegalStateException("Can not create adaptive extenstion " + type + ", cause: " + e.getMessage(), e);
        }
    }
```
我们来看一下`getAdaptiveExtensionClass()`这个方法实现
```java
   private Class<?> getAdaptiveExtensionClass() {
       //调用getExtensionClasses方法为cachedClasses赋值
        getExtensionClasses();
        if (cachedAdaptiveClass != null) {
            return cachedAdaptiveClass;
        }
        return cachedAdaptiveClass = createAdaptiveExtensionClass();
    }

     //这个方法作用是为cachedClasses 赋值
     private Map<String, Class<?>> getExtensionClasses() {
        Map<String, Class<?>> classes = cachedClasses.get();
        if (classes == null) {
            synchronized (cachedClasses) {
                classes = cachedClasses.get();
                if (classes == null) {
                    classes = loadExtensionClasses();
                    cachedClasses.set(classes);
                }
            }
        }
        return classes;
    }
```

