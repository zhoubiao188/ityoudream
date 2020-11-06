#### jdk 8格式化货币
```java
class MyMoney {
	private final int money;

	public MyMoney(int money) {
		this.money = money;
	}

	public void printMoney(Function<Integer, String> moneyFormat) {
		System.out.println("account:" + moneyFormat.apply(this.money));
	}
}

public class MoneyDemo {

	public static void main(String[] args) {
		MyMoney me = new MyMoney(99999999);

		Function<Integer, String> moneyFormat = i -> new DecimalFormat("#,###")
				.format(i);
		
		me.printMoney(moneyFormat.andThen(s -> "RMB: " + s));
	}

}

```