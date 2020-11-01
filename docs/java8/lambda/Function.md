### java方法使用
```java
import java.util.function.Function;
public class CurryDemo {

	public static void main(String[] args) {
		Function<Integer, Function<Integer, Integer>> fun = x -> y -> x
				+ y;
		System.out.println(fun.apply(2).apply(3));

		Function<Integer, Function<Integer, Function<Integer, Integer>>> fun2 = x -> y -> z -> x
				+ y + z;
		System.out.println(fun2.apply(2).apply(3).apply(4));

		int[] nums = { 2, 3, 4 };
		Function f = fun2;
		
		for (int i = 0; i < nums.length; i++) {
			if (f instanceof Function) {
				Object obj = f.apply(nums[i]);
				if (obj instanceof Function) {
					f = (Function) obj;
				} else {
					System.out.println("num" + obj);
				}
			}
		}
	}
}

```