"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Conta {
  idConta: number // Made ID required instead of optional
  agencia: string
  numero: string
  saldo: number
  id_Cliente?: number
}

export function ContasPage() {
  const [contas, setContas] = useState<Conta[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingConta, setEditingConta] = useState<Conta | null>(null)

  const [formData, setFormData] = useState<Conta>({
    idConta: 0, // Added ID field to form data
    agencia: "",
    numero: "",
    saldo: 0,
    id_Cliente: undefined,
  })

  useEffect(() => {
    fetchContas()
  }, [])

  const fetchContas = async () => {
    try {
      console.log(" Buscando contas...")
      const response = await fetch("http://localhost:8080/api/contas")
      console.log(" Response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log(" Dados recebidos:", data)
        setContas(data)
      } else {
        console.log(" Erro na resposta:", response.statusText)
        alert("Erro ao carregar contas. Verifique se o backend está rodando.")
      }
    } catch (error) {
      console.log(" Erro de conexão:", error)
      alert("Erro de conexão. Verifique se o backend está rodando na porta 8080.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log(" Iniciando salvamento de conta...")
    console.log(" Dados do formulário:", formData)
    console.log(" Editando conta:", editingConta)

    try {
      const url = editingConta
        ? `http://localhost:8080/api/contas/${editingConta.idConta}`
        : "http://localhost:8080/api/contas"

      const method = editingConta ? "PUT" : "POST"

      console.log(" URL:", url)
      console.log(" Método:", method)
      console.log(" Payload:", JSON.stringify(formData))

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      console.log(" Response status:", response.status)
      console.log(" Response headers:", response.headers)

      if (response.ok) {
        const responseData = await response.text()
        console.log(" Response data:", responseData)
        alert(`Conta ${editingConta ? "atualizada" : "criada"} com sucesso!`)
        fetchContas()
        resetForm()
      } else {
        const errorText = await response.text()
        console.log(" Erro na resposta:", errorText)
        alert(`Erro ao salvar conta. Status: ${response.status}. Erro: ${errorText}`)
      }
    } catch (error) {
      console.log(" Erro de conexão:", error)
      alert("Erro de conexão com o servidor.")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta conta?")) return

    try {
      console.log(" Excluindo conta ID:", id)
      const response = await fetch(`http://localhost:8080/api/contas/${id}`, {
        method: "DELETE",
      })

      console.log(" Delete response status:", response.status)

      if (response.ok) {
        alert("Conta excluída com sucesso!")
        fetchContas()
      } else {
        const errorText = await response.text()
        console.log(" Erro ao excluir:", errorText)
        alert(`Erro ao excluir conta. Status: ${response.status}`)
      }
    } catch (error) {
      console.log(" Erro de conexão ao excluir:", error)
      alert("Erro de conexão com o servidor.")
    }
  }

  const resetForm = () => {
    setFormData({
      idConta: 0, // Reset ID field
      agencia: "",
      numero: "",
      saldo: 0,
      id_Cliente: undefined,
    })
    setEditingConta(null)
    setShowForm(false)
  }

  const openEditForm = (conta: Conta) => {
    setEditingConta(conta)
    setFormData(conta)
    setShowForm(true)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const totalBalance = contas.reduce((sum, conta) => sum + conta.saldo, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Carregando contas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="gradient-accent rounded-xl p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Contas Bancárias</h1>
            <p className="text-white/80">Gerencie as contas do sistema</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
            <div className="text-white/80 text-sm">Saldo total</div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-foreground">Lista de Contas</h2>
          <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm font-medium">
            {contas.length} registros
          </span>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg"
        >
          + Nova Conta
        </Button>
      </div>

      {showForm && (
        <Card className="card-shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-accent/5 to-primary/5 border-b">
            <CardTitle className="text-xl">{editingConta ? "Editar Conta" : "Nova Conta"}</CardTitle>
            <CardDescription>
              {editingConta ? "Atualize as informações da conta" : "Preencha os dados da nova conta"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="idConta" className="text-sm font-medium text-foreground">
                    ID Conta *
                  </Label>
                  <Input
                    id="idConta"
                    type="number"
                    value={formData.idConta}
                    onChange={(e) => setFormData({ ...formData, idConta: Number.parseInt(e.target.value) || 0 })}
                    required
                    className="h-11 border-border focus:border-accent focus:ring-accent/20"
                    placeholder="Digite o ID da conta"
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agencia" className="text-sm font-medium text-foreground">
                    Agência *
                  </Label>
                  <Input
                    id="agencia"
                    value={formData.agencia}
                    onChange={(e) => setFormData({ ...formData, agencia: e.target.value })}
                    required
                    className="h-11 border-border focus:border-accent focus:ring-accent/20"
                    placeholder="Ex: 1234"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numero" className="text-sm font-medium text-foreground">
                    Número da Conta *
                  </Label>
                  <Input
                    id="numero"
                    value={formData.numero}
                    onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                    required
                    className="h-11 border-border focus:border-accent focus:ring-accent/20"
                    placeholder="Ex: 12345-6"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="saldo" className="text-sm font-medium text-foreground">
                    Saldo *
                  </Label>
                  <Input
                    id="saldo"
                    type="number"
                    step="0.01"
                    value={formData.saldo}
                    onChange={(e) => setFormData({ ...formData, saldo: Number.parseFloat(e.target.value) || 0 })}
                    required
                    className="h-11 border-border focus:border-accent focus:ring-accent/20"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="id_Cliente" className="text-sm font-medium text-foreground">
                    ID Cliente
                  </Label>
                  <Input
                    id="id_Cliente"
                    type="number"
                    value={formData.id_Cliente || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        id_Cliente: e.target.value ? Number.parseInt(e.target.value) : undefined,
                      })
                    }
                    className="h-11 border-border focus:border-accent focus:ring-accent/20"
                    placeholder="ID do cliente (opcional)"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8">
                  {editingConta ? "Atualizar" : "Criar"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="px-8 bg-transparent">
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="card-shadow border-0">
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="p-4 text-left text-sm font-semibold text-foreground">ID</th>
                  <th className="p-4 text-left text-sm font-semibold text-foreground">Agência</th>
                  <th className="p-4 text-left text-sm font-semibold text-foreground">Número</th>
                  <th className="p-4 text-left text-sm font-semibold text-foreground">Saldo</th>
                  <th className="p-4 text-left text-sm font-semibold text-foreground">ID Cliente</th>
                  <th className="p-4 text-left text-sm font-semibold text-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {contas.map((conta, index) => (
                  <tr
                    key={conta.idConta}
                    className={`border-b border-border hover:bg-muted/30 transition-colors ${
                      index % 2 === 0 ? "bg-background" : "bg-muted/10"
                    }`}
                  >
                    <td className="p-4">
                      <span className="bg-accent/10 text-accent-foreground px-2 py-1 rounded-md text-sm font-medium">
                        {conta.idConta}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-foreground">{conta.agencia}</td>
                    <td className="p-4 font-mono text-sm">{conta.numero}</td>
                    <td className="p-4">
                      <span className={`font-semibold ${conta.saldo >= 0 ? "text-success" : "text-destructive"}`}>
                        {formatCurrency(conta.saldo)}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{conta.id_Cliente || "—"}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditForm(conta)}
                          className="h-8 px-3 text-xs hover:bg-accent hover:text-accent-foreground"
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(conta.idConta)}
                          className="h-8 px-3 text-xs"
                        >
                          Excluir
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {contas.length === 0 && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma conta cadastrada</h3>
                <p className="text-muted-foreground mb-4">Comece adicionando a primeira conta ao sistema</p>
                <Button onClick={() => setShowForm(true)} className="bg-accent hover:bg-accent/90">
                  + Adicionar Conta
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
