package onebot.model;

/**
 * 群成员信息
 */
public class GroupMember {
    private long group_id;
    private long user_id;
    private String nickname;
    private String card;
    private String sex;
    private int age;
    private String area;
    private long join_time;
    private long last_sent_time;
    private String level;
    private int qq_level;
    private String role; // owner, admin, member
    private String title;
    private long title_expire_time;
    private boolean unfriendly;
    private boolean card_changeable;
    private long shut_up_timestamp;
    private boolean is_robot;

    public long getGroupId() { return group_id; }
    public void setGroupId(long groupId) { this.group_id = groupId; }

    public long getUserId() { return user_id; }
    public void setUserId(long userId) { this.user_id = userId; }

    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }

    public String getCard() { return card; }
    public void setCard(String card) { this.card = card; }

    public String getSex() { return sex; }
    public void setSex(String sex) { this.sex = sex; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public long getJoinTime() { return join_time; }
    public void setJoinTime(long joinTime) { this.join_time = joinTime; }

    public long getLastSentTime() { return last_sent_time; }
    public void setLastSentTime(long lastSentTime) { this.last_sent_time = lastSentTime; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public int getQqLevel() { return qq_level; }
    public void setQqLevel(int qqLevel) { this.qq_level = qqLevel; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public long getShutUpTimestamp() { return shut_up_timestamp; }
    public void setShutUpTimestamp(long shutUpTimestamp) { this.shut_up_timestamp = shutUpTimestamp; }

    public boolean isRobot() { return is_robot; }
    public void setRobot(boolean robot) { this.is_robot = robot; }

    @Override
    public String toString() {
        return "GroupMember{group_id=" + group_id + ", user_id=" + user_id +
               ", nickname='" + nickname + "', card='" + card + "', role='" + role + "'}";
    }
}
