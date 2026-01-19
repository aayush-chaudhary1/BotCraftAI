import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BarChart3, TrendingUp, MessageSquare, HelpCircle, Clock } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const conversationData = [
  { day: 'Mon', conversations: 0 },
  { day: 'Tue', conversations: 0 },
  { day: 'Wed', conversations: 0 },
  { day: 'Thu', conversations: 0 },
  { day: 'Fri', conversations: 0 },
  { day: 'Sat', conversations: 0 },
  { day: 'Sun', conversations: 0 },
];

const messageData = [
  { day: 'Mon', messages: 0 },
  { day: 'Tue', messages: 0 },
  { day: 'Wed', messages: 0 },
  { day: 'Thu', messages: 0 },
  { day: 'Fri', messages: 0 },
  { day: 'Sat', messages: 0 },
  { day: 'Sun', messages: 0 },
];

const topQuestions: any[] = [];

const unansweredQueries: any[] = [];

export default function Analytics() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">
          Track how users interact with your chatbot.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Conversations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl mb-1">0</div>
                <div className="text-sm text-gray-500">No data yet</div>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Messages Today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl mb-1">0</div>
                <div className="text-sm text-gray-500">No messages yet</div>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Avg Response Time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl mb-1">--</div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>No data</span>
                </div>
              </div>
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Unanswered Queries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl mb-1">0</div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <HelpCircle className="w-4 h-4" />
                  <span>All clear</span>
                </div>
              </div>
              <HelpCircle className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Conversations per Day</CardTitle>
            <CardDescription>Number of conversations started each day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="conversations" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Messages per Day</CardTitle>
            <CardDescription>Total messages exchanged daily</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={messageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="messages" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Most Asked Questions</CardTitle>
            <CardDescription>Top 5 questions from users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topQuestions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No questions asked yet</p>
                </div>
              ) : (
                topQuestions.map((item, index) => (
                  <div key={index} className="flex items-start justify-between gap-4 pb-3 border-b last:border-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm">
                          {index + 1}
                        </span>
                        <p className="text-sm">{item.question}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg">{item.count}</div>
                      <div className="text-xs text-gray-500">asks</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Unanswered Queries</CardTitle>
            <CardDescription>Questions the chatbot couldn't answer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {unansweredQueries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <HelpCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No unanswered queries</p>
                </div>
              ) : (
                unansweredQueries.map((item, index) => (
                  <div key={index} className="flex items-start justify-between gap-4 pb-3 border-b last:border-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <HelpCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
                        <p className="text-sm">{item.question}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg text-orange-600">{item.count}</div>
                      <div className="text-xs text-gray-500">times</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insight Card */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-200 rounded-full">
              <TrendingUp className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">No Data Yet</p>
              <p className="text-sm text-gray-700">
                Start collecting data by creating a chatbot and having conversations. Analytics will appear here.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}