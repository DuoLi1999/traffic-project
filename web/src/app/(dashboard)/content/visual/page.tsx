"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Image,
  Video,
  UserCircle,
  Palette,
  Loader2,
} from "lucide-react";

export default function VisualPage() {
  const [activeTab, setActiveTab] = useState("poster");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">视觉内容</h1>
        <p className="text-muted-foreground">
          AI 海报生成、视频生成、数字人播报
        </p>
      </div>

      <div className="rounded-lg border border-dashed border-blue-300 bg-blue-50 p-4 text-center">
        <p className="text-sm text-blue-600">
          视觉内容生成需对接图像/视频生成AI服务（如 DALL-E、Stable Diffusion、数字人平台），当前展示为功能规划
        </p>
      </div>

      <Tabs>
        <TabsList>
          <TabsTrigger active={activeTab === "poster"} onClick={() => setActiveTab("poster")}>
            <Image className="h-4 w-4 mr-1" />
            海报生成
          </TabsTrigger>
          <TabsTrigger active={activeTab === "video"} onClick={() => setActiveTab("video")}>
            <Video className="h-4 w-4 mr-1" />
            视频生成
          </TabsTrigger>
          <TabsTrigger active={activeTab === "avatar"} onClick={() => setActiveTab("avatar")}>
            <UserCircle className="h-4 w-4 mr-1" />
            数字人播报
          </TabsTrigger>
        </TabsList>

        <TabsContent>
          {activeTab === "poster" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    AI 海报生成
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">待对接图像生成服务</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">海报主题</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      placeholder="例如：春运安全出行"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">尺寸</label>
                    <select className="w-full px-3 py-2 border rounded-lg text-sm">
                      <option>竖版海报 (1080x1920)</option>
                      <option>横版海报 (1920x1080)</option>
                      <option>公众号封面 (900x383)</option>
                      <option>朋友圈图片 (1080x1080)</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">风格</label>
                    <select className="w-full px-3 py-2 border rounded-lg text-sm">
                      <option>官方严肃</option>
                      <option>卡通可爱</option>
                      <option>简约现代</option>
                      <option>中国风</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">色调</label>
                    <select className="w-full px-3 py-2 border rounded-lg text-sm">
                      <option>蓝色（交警主色调）</option>
                      <option>红色（警示）</option>
                      <option>绿色（安全）</option>
                      <option>暖色（温馨）</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">宣传语</label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                    rows={2}
                    placeholder="输入海报上的宣传语..."
                  />
                </div>

                <div className="flex items-center justify-center h-48 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                  <div className="text-center">
                    <Image className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">海报预览区域</p>
                    <p className="text-xs text-gray-400">对接图像生成服务后将显示生成结果</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "video" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    AI 视频生成
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">待对接视频生成服务</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">视频类型</label>
                    <select className="w-full px-3 py-2 border rounded-lg text-sm">
                      <option>安全提示短视频 (15s)</option>
                      <option>宣传片 (30s-60s)</option>
                      <option>案例警示片 (60s-120s)</option>
                      <option>科普教育视频 (3-5min)</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">目标平台</label>
                    <select className="w-full px-3 py-2 border rounded-lg text-sm">
                      <option>抖音 (竖版 9:16)</option>
                      <option>微信视频号 (竖版 9:16)</option>
                      <option>微博 (横版 16:9)</option>
                      <option>通用 (横版 16:9)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">视频脚本/描述</label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                    rows={4}
                    placeholder="描述视频内容或粘贴脚本..."
                  />
                </div>

                <div className="flex items-center justify-center h-48 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                  <div className="text-center">
                    <Video className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">视频预览区域</p>
                    <p className="text-xs text-gray-400">对接视频生成服务后将显示生成结果</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "avatar" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5" />
                    数字人播报
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">待对接数字人平台</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { name: "交警小明", style: "男性 · 正式", avatar: "👮" },
                    { name: "安安姐姐", style: "女性 · 亲切", avatar: "👮‍♀️" },
                    { name: "卡通交警", style: "动画 · 活泼", avatar: "🚔" },
                  ].map((char) => (
                    <div key={char.name} className="border rounded-lg p-4 text-center hover:border-blue-500 cursor-pointer transition">
                      <div className="text-4xl mb-2">{char.avatar}</div>
                      <p className="text-sm font-medium">{char.name}</p>
                      <p className="text-xs text-gray-500">{char.style}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">播报文稿</label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                    rows={4}
                    placeholder="输入数字人播报的文稿内容..."
                  />
                </div>

                <div className="flex items-center justify-center h-48 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                  <div className="text-center">
                    <UserCircle className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">数字人播报预览区域</p>
                    <p className="text-xs text-gray-400">对接数字人平台后将显示实时预览</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
