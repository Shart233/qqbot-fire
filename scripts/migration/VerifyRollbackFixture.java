import onebot.client.OneBotClient;
import onebot.client.OneBotConnection;
import onebot.scheduler.ScheduleManager;
import java.util.Map;

/** 在回退副本中实际加载 Java 调度器，确认成功与未决目标不会再次发送。 */
public class VerifyRollbackFixture {
    static class Capture extends OneBotConnection {
        int sends = 0;
        Capture() { super("ws://127.0.0.1:1", null); }
        @Override public boolean isConnected() { return true; }
        @Override public Map<String, Object> callApi(String action, Map<String, Object> params) {
            if (action.startsWith("send_")) sends++;
            return Map.of("message_id", 99L, "online", true);
        }
    }
    public static void main(String[] args) {
        var capture = new Capture();
        var scheduler = new ScheduleManager("default");
        scheduler.setBot(new OneBotClient(capture));
        scheduler.triggerNow("daily");
        scheduler.stop();
        if (capture.sends != 0) throw new AssertionError("回退后发生重复发送: " + capture.sends);
        System.out.println("Java 回退验证通过：成功和未决目标均未重发");
    }
}
