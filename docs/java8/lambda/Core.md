#### Jdk8 断言
```java
public class Core {

	public static void main(String[] args) {
		Consumer<String> consumer = s-> System.out.println(s);
		consumer.accept("222");
		System.out.println(consumer.getClass());
		
		CoreDemo demo = new CoreDemo();
		
		demo.test2();
		// demo.test2();
	}
	
	public void test2() {
		Consumer<Integer> consumer = s-> {
			System.out.println(this);
			System.out.println(s);			
		};
		//Consumer<String> consumer = System.out::println;
		consumer.accept(2222);
		System.out.println(consumer.getClass());
	}
	
//	public void lambda$0(String string) {
//		
//	}
}

```