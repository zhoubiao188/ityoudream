### 接口强转
```java
@FunctionalInterface
interface IMath {
	int add(int x, int y);
}

@FunctionalInterface
interface IMath2 {
	int sub(int x, int y);
}


public class TypeDemo {

	public static void main(String[] args) {
		IMath lambda = (x, y) -> x + y;

		IMath[] lambdas = { (x, y) -> x + y };


		Object lambda2 = (IMath) (x, y) -> x + y;
		
		IMath createLambda = createLambda();
		
		TypeDemo demo = new TypeDemo();
		demo.test( (IMath2)(x, y) -> x + y);
	}
	
	public void test(IMath math) {
		
	}
	
	public void test(IMath2 math) {
		
	}
	
	public static IMath createLambda() {
		return  (x, y) -> x + y;
	}

}

```