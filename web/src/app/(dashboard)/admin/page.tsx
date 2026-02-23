"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Settings,
  Users,
  Shield,
  Building2,
} from "lucide-react";

const SAMPLE_USERS = [
  { id: "1", name: "张三", role: "系统管理员", dept: "信息中心", status: "active" },
  { id: "2", name: "李四", role: "宣传科编辑", dept: "宣传科", status: "active" },
  { id: "3", name: "王五", role: "科室领导", dept: "宣传科", status: "active" },
  { id: "4", name: "赵六", role: "分管领导", dept: "办公室", status: "active" },
  { id: "5", name: "孙七", role: "新媒体运营", dept: "宣传科", status: "inactive" },
];

const ROLES = [
  { name: "系统管理员", permissions: ["全部权限"], count: 1 },
  { name: "分管领导", permissions: ["终审", "查看报告", "审批"], count: 1 },
  { name: "科室领导", permissions: ["复审", "查看报告", "编辑计划"], count: 2 },
  { name: "新媒体负责人", permissions: ["初审", "发布内容", "编辑计划"], count: 1 },
  { name: "宣传科编辑", permissions: ["编辑内容", "提交审核", "查看素材"], count: 3 },
  { name: "新媒体运营", permissions: ["编辑内容", "发布内容", "查看数据"], count: 2 },
];

const DEPTS = [
  { name: "信息中心", leader: "张三", members: 3 },
  { name: "宣传科", leader: "王五", members: 8 },
  { name: "办公室", leader: "赵六", members: 5 },
  { name: "秩序科", leader: "—", members: 12 },
  { name: "事故科", leader: "—", members: 10 },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">权限管理</h1>
        <p className="text-muted-foreground">
          用户管理、角色管理、部门管理
        </p>
      </div>

      <div className="rounded-lg border border-dashed border-blue-300 bg-blue-50 p-4 text-center">
        <p className="text-sm text-blue-600">
          本页面需对接统一身份认证系统，当前展示为UI框架和模拟数据
        </p>
      </div>

      <Tabs>
        <TabsList>
          <TabsTrigger active={activeTab === "users"} onClick={() => setActiveTab("users")}>
            <Users className="h-4 w-4 mr-1" />
            用户管理
          </TabsTrigger>
          <TabsTrigger active={activeTab === "roles"} onClick={() => setActiveTab("roles")}>
            <Shield className="h-4 w-4 mr-1" />
            角色管理
          </TabsTrigger>
          <TabsTrigger active={activeTab === "depts"} onClick={() => setActiveTab("depts")}>
            <Building2 className="h-4 w-4 mr-1" />
            部门管理
          </TabsTrigger>
        </TabsList>

        <TabsContent>
          {activeTab === "users" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>用户列表</CardTitle>
                  <button className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    + 新建用户
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="pb-2 font-medium">姓名</th>
                      <th className="pb-2 font-medium">角色</th>
                      <th className="pb-2 font-medium">部门</th>
                      <th className="pb-2 font-medium">状态</th>
                      <th className="pb-2 font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_USERS.map((user) => (
                      <tr key={user.id} className="border-b last:border-0">
                        <td className="py-3 font-medium">{user.name}</td>
                        <td className="py-3">{user.role}</td>
                        <td className="py-3">{user.dept}</td>
                        <td className="py-3">
                          <Badge variant={user.status === "active" ? "success" : "secondary"} className="text-xs">
                            {user.status === "active" ? "启用" : "禁用"}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <button className="text-xs text-blue-600 hover:text-blue-800 mr-2">编辑</button>
                          <button className="text-xs text-red-600 hover:text-red-800">禁用</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

          {activeTab === "roles" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>角色列表</CardTitle>
                  <button className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    + 新建角色
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ROLES.map((role) => (
                    <div key={role.name} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{role.name}</span>
                          <Badge variant="secondary" className="text-xs">{role.count} 人</Badge>
                        </div>
                        <button className="text-xs text-blue-600 hover:text-blue-800">编辑权限</button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {role.permissions.map((perm) => (
                          <Badge key={perm} variant="outline" className="text-xs">
                            {perm}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "depts" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>部门列表</CardTitle>
                  <button className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    + 新建部门
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="pb-2 font-medium">部门名称</th>
                      <th className="pb-2 font-medium">负责人</th>
                      <th className="pb-2 font-medium">人数</th>
                      <th className="pb-2 font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEPTS.map((dept) => (
                      <tr key={dept.name} className="border-b last:border-0">
                        <td className="py-3 font-medium">{dept.name}</td>
                        <td className="py-3">{dept.leader}</td>
                        <td className="py-3">{dept.members} 人</td>
                        <td className="py-3">
                          <button className="text-xs text-blue-600 hover:text-blue-800 mr-2">编辑</button>
                          <button className="text-xs text-blue-600 hover:text-blue-800">管理成员</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
