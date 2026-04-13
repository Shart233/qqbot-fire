package onebot.model;

/**
 * 登录号信息
 */
public class LoginInfo {
    private long user_id;
    private String nickname;

    public long getUserId() { return user_id; }
    public void setUserId(long userId) { this.user_id = userId; }

    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }

    @Override
    public String toString() {
        return "LoginInfo{user_id=" + user_id + ", nickname='" + nickname + "'}";
    }
}
