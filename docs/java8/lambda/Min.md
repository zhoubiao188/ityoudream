### jdk 8 数组获取最小值
```java 获取最小值
public class MinDemo {

	public static void main(String[] args) {
		int[] nums = {33,55,-55,90,-666,90};
		//传统写法
		int min = Integer.MAX_VALUE;
		for (int i : nums) {
			if(i < min) {
				min = i;
			}
		}
		
		System.out.println(min);
		
		// jdk8 写法
		int min2 = IntStream.of(nums).parallel().min().getAsInt();
		System.out.println(min2);
	}

}
```