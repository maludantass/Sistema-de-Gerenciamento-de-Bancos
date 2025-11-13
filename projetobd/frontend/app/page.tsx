"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FuncionariosPage } from "@/components/funcionarios-page"
import { ContasPage } from "@/components/contas-page"
import { DepositosPage } from "@/components/depositos-page"
import { SaquesPage } from "@/components/saques-page"
import { DashboardPage } from "@/components/dashboard-page"
import { ConsultasPage } from "@/components/consultas-page"
import { GraficosPage } from "@/components/graficos-page"
import {
  Users,
  CreditCard,
  Database,
  BarChart3,
  TrendingUp,
  ArrowDownCircle,
  ArrowUpCircle,
  Search,
} from "lucide-react"

type ActivePage = "dashboard" | "funcionarios" | "contas" | "depositos" | "saques" | "consultas" | "graficos"

export default function HomePage() {
  const [activePage, setActivePage] = useState<ActivePage>("dashboard")

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
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant={activePage === "dashboard" ? "default" : "ghost"}
                onClick={() => setActivePage("dashboard")}
                className="gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Dashboard
              </Button>
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
              <Button
                variant={activePage === "depositos" ? "default" : "ghost"}
                onClick={() => setActivePage("depositos")}
                className="gap-2"
              >
                <ArrowDownCircle className="w-4 h-4" />
                Depósitos
              </Button>
              <Button
                variant={activePage === "saques" ? "default" : "ghost"}
                onClick={() => setActivePage("saques")}
                className="gap-2"
              >
                <ArrowUpCircle className="w-4 h-4" />
                Saques
              </Button>
              <Button
                variant={activePage === "consultas" ? "default" : "ghost"}
                onClick={() => setActivePage("consultas")}
                className="gap-2"
              >
                <Search className="w-4 h-4" />
                Consultas
              </Button>
              <Button
                variant={activePage === "graficos" ? "default" : "ghost"}
                onClick={() => setActivePage("graficos")}
                className="gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Gráficos
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {activePage === "dashboard" && <DashboardPage />}
          {activePage === "funcionarios" && <FuncionariosPage />}
          {activePage === "contas" && <ContasPage />}
          {activePage === "depositos" && <DepositosPage />}
          {activePage === "saques" && <SaquesPage />}
          {activePage === "consultas" && <ConsultasPage />}
          {activePage === "graficos" && <GraficosPage />}
        </div>
      </div>
    </div>
  )
}
