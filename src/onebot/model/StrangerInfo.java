package onebot.model;

/**
 * 陌生人信息
 */
public class StrangerInfo {
    private long user_id;
    private String nickname;
    private String sex;
    private int age;
    private String qid;
    private int level;
    private int login_days;

    public long getUserId() { return user_id; }
    public void setUserId(long userId) { this.user_id = userId; }

    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }

    public String getSex() { return sex; }
    public void setSex(String sex) { this.sex = sex; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getQid() { return qid; }
    public void setQid(String qid) { this.qid = qid; }

    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }

    public int getLoginDays() { return login_days; }
    public void setLoginDays(int loginDays) { this.login_days = loginDays; }

    @Override
    public String toString() {
        return "StrangerInfo{user_id=" + user_id + ", nickname='" + nickname + "'}";
    }
}
