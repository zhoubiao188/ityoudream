### jdk 8中延迟异步调用函数方法
```java
class Log {

	/**
	 * 不打印debug级别的日志
	 * 
	 * @return
	 */
	public boolean isDebug() {
		return true;
	}

	public void debug(String string) {
		if (this.isDebug()) {
			System.out.println(string);
		}
	}

	/**
	 * 
	 * @param supplier
	 *            传入一个提供字符串的函数
	 */
	public void debug(Supplier<String> supplier) {
		if (this.isDebug()) {
			// 真正要打印的时候，才调用
			System.out.println(supplier.get());
		}
	}

}

public class Lazy {

	public static void main(String[] args) {
		Lazy demo = new Lazy();
		Log log = new Log();
		log.debug(() -> "打印日志之前必须判断日志级别: " + demo.toString());
	}

	@Override
	public String toString() {
		System.out.println("toString 被调用了");
		return super.toString();
	}

}
```

#### 最终操作和中间操作
```java
class MyLazy {
	private final IntSupplier data;

	public MyLazy(IntSupplier data) {
		this.data = data;
	}

	/**
	 * 中间操作 不调用最终操作value，那么op不会真正被执行
	 */
	public MyLazy some(IntUnaryOperator op) {
		// 为了不影响之前数据，每次返回一个新对象
		return new MyLazy( () -> op.applyAsInt(this.data.getAsInt()));
	}

	/**
	 * 最终操作
	 */
	public int value() {
		return this.data.getAsInt();
	}
}

public class LazyDemo2 {

	public static void main(String[] args) {
		MyLazy lazy = new MyLazy(()->10);

		System.out.println("没有调用value最终操作，中间操作的日志不应该打印");
		// 我们要实现不调用最终操作value的情况下
		// 中间操作some存入的函数并不会真正执行
		lazy.some(LazyDemo2::doubleNumber).some(LazyDemo2::doubleNumber);
		
		System.out.println("调用value最终操作");
		int value = lazy.some(LazyDemo2::doubleNumber)
				.some(LazyDemo2::doubleNumber).value();

		System.out.println("value= " + value);

		// map 就是流里面的中间操作
		// sum 就是流里面的最终操作

		// int sum = IntStream.rangeClosed(1, 3).map(LazyDemo2::doubleNumber)
		// .sum();
		// System.out.println("sum=" + sum);

		// 假设流里面不调用最终操作，那么所有的中间操作都不会真正被执行
		// 这就是流的惰性求值
		// 下面的代码不执行sum这种最终操作
		IntStream.rangeClosed(1, 3).map(LazyDemo2::doubleNumber);
	}

	public static int doubleNumber(int i) {
		System.out.println("方法被调用了");
		return i * 2;
	}

}

```