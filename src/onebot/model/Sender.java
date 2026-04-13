package onebot.model;

/**
 * 消息发送者信息
 */
public class Sender {
    private long user_id;
    private String nickname;
    private String card;
    private String role; // owner, admin, member
    private String sex;
    private int age;
    private String area;
    private String level;
    private String title;

    public long getUserId() { return user_id; }
    public void setUserId(long userId) { this.user_id = userId; }

    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }

    public String getCard() { return card; }
    public void setCard(String card) { this.card = card; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getSex() { return sex; }
    public void setSex(String sex) { this.sex = sex; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    @Override
    public String toString() {
        return "Sender{user_id=" + user_id + ", nickname='" + nickname +
               "', card='" + card + "', role='" + role + "'}";
    }
}
