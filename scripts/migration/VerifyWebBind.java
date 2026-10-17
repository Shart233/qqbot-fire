import onebot.web.WebConsoleServer;
import com.sun.net.httpserver.HttpServer;

/** 验证 Java 回退服务可显式绑定容器网卡，默认仍为回环地址。 */
public class VerifyWebBind {
    public static void main(String[] args) throws Exception {
        var web = new WebConsoleServer(null, 0);
        try {
            web.start();
            var field = WebConsoleServer.class.getDeclaredField("server");
            field.setAccessible(true);
            var server = (HttpServer) field.get(web);
            var actual = server.getAddress().getAddress().getHostAddress();
            if (!(args[0].equals("0.0.0.0") ? server.getAddress().getAddress().isAnyLocalAddress() : actual.equals(args[0]))) throw new AssertionError("预期监听 " + args[0] + "，实际 " + actual);
            System.out.println("Java 回退监听验证通过：" + actual);
        } finally { web.stop(); }
    }
}
