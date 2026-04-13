package onebot.model;

/**
 * 好友信息
 */
public class FriendInfo {
    private long user_id;
    private String nickname;
    private String remark;
    private String sex;
    private int level;
    private int age;
    private String qid;

    public long getUserId() { return user_id; }
    public void setUserId(long userId) { this.user_id = userId; }

    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }

    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }

    public String getSex() { return sex; }
    public void setSex(String sex) { this.sex = sex; }

    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getQid() { return qid; }
    public void setQid(String qid) { this.qid = qid; }

    @Override
    public String toString() {
        return "FriendInfo{user_id=" + user_id + ", nickname='" + nickname +
               "', remark='" + remark + "'}";
    }
}
