package onebot.model;

import java.util.Map;

/**
 * OneBot 11 统一响应结构
 */
public class BaseResponse<T> {
    private String status;
    private int retcode;
    private T data;
    private String message;
    private String wording;

    public BaseResponse() {}

    public boolean isOk() {
        return "ok".equals(status) && retcode == 0;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getRetcode() { return retcode; }
    public void setRetcode(int retcode) { this.retcode = retcode; }

    public T getData() { return data; }
    public void setData(T data) { this.data = data; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getWording() { return wording; }
    public void setWording(String wording) { this.wording = wording; }

    @Override
    public String toString() {
        return "BaseResponse{status='" + status + "', retcode=" + retcode +
               ", data=" + data + ", message='" + message + "'}";
    }
}
