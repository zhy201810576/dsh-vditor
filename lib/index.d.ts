/** dsh-vditor-composer Host 半边：附件落盘、系统文件选择器、工作区文件搜索的 HTTP 路由。 */
declare const name = "dsh-vditor-composer";
/** 注册 /plugins/vditor-composer 前缀路由（webServer/subprocess/fs 就绪后激活）。 */
declare function apply(ctx: unknown): void;
export { apply, name };
