"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FuncionariosPage } from "@/components/funcionarios-page"
import { ContasPage } from "@/components/contas-page"
import { Users, CreditCard, Database, TrendingUp } from "lucide-react"

type ActivePage = "funcionarios" | "contas"

export default function HomePage() {
  const [activePage, setActivePage] = useState<ActivePage>("funcionarios")

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Database className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">BankSystem</h1>
                <p className="text-sm text-muted-foreground">Management Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={activePage === "funcionarios" ? "default" : "ghost"}
                onClick={() => setActivePage("funcionarios")}
                className="gap-2"
              >
                <Users className="w-4 h-4" />
                Funcionários
              </Button>
              <Button
                variant={activePage === "contas" ? "default" : "ghost"}
                onClick={() => setActivePage("contas")}
                className="gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Contas
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Funcionários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Carregando dados...</p>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contas</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Carregando dados...</p>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sistema Status</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">Online</div>
              <p className="text-xs text-muted-foreground">Backend conectado</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">{activePage === "funcionarios" ? <FuncionariosPage /> : <ContasPage />}</div>
      </div>
    </div>
  )
}
