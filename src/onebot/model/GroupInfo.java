package onebot.model;

/**
 * 群信息
 */
public class GroupInfo {
    private long group_id;
    private String group_name;
    private String group_remark;
    private int member_count;
    private int max_member_count;
    private boolean group_all_shut;

    public long getGroupId() { return group_id; }
    public void setGroupId(long groupId) { this.group_id = groupId; }

    public String getGroupName() { return group_name; }
    public void setGroupName(String groupName) { this.group_name = groupName; }

    public String getGroupRemark() { return group_remark; }
    public void setGroupRemark(String groupRemark) { this.group_remark = groupRemark; }

    public int getMemberCount() { return member_count; }
    public void setMemberCount(int memberCount) { this.member_count = memberCount; }

    public int getMaxMemberCount() { return max_member_count; }
    public void setMaxMemberCount(int maxMemberCount) { this.max_member_count = maxMemberCount; }

    public boolean isGroupAllShut() { return group_all_shut; }
    public void setGroupAllShut(boolean groupAllShut) { this.group_all_shut = groupAllShut; }

    @Override
    public String toString() {
        return "GroupInfo{group_id=" + group_id + ", group_name='" + group_name +
               "', member_count=" + member_count + "/" + max_member_count + "}";
    }
}
