package onebot.model;

/**
 * 版本信息
 */
public class VersionInfo {
    private String app_name;
    private String app_version;
    private String protocol_version;

    public String getAppName() { return app_name; }
    public void setAppName(String appName) { this.app_name = appName; }

    public String getAppVersion() { return app_version; }
    public void setAppVersion(String appVersion) { this.app_version = appVersion; }

    public String getProtocolVersion() { return protocol_version; }
    public void setProtocolVersion(String protocolVersion) { this.protocol_version = protocolVersion; }

    @Override
    public String toString() {
        return "VersionInfo{app_name='" + app_name + "', app_version='" + app_version +
               "', protocol_version='" + protocol_version + "'}";
    }
}
