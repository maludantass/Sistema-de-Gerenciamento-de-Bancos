"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpCircle } from "lucide-react"

interface Saque {
  idTransacao: number
  valorSaque: number
  dataHora: string
  idConta: number
  tipoSaque: string
}

export function SaquesPage() {
  const [saques, setSaques] = useState<Saque[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSaque, setEditingSaque] = useState<Saque | null>(null)
  const [formData, setFormData] = useState({
    idTransacao: 0,
    valorSaque: 0,
    dataHora: "",
    idConta: 0,
    tipoSaque: "",
  })

  useEffect(() => {
    fetchSaques()
  }, [])

  const fetchSaques = async () => {
    try {
      console.log("[v0] Buscando saques...")
      const response = await fetch("http://localhost:8080/api/saques")
      console.log("[v0] Status da resposta:", response.status)
      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Saques recebidos:", data)
        setSaques(data)
      } else {
        console.error("[v0] Erro ao carregar saques:", response.status)
        alert("Erro ao carregar saques. Verifique se o backend está rodando.")
      }
    } catch (error) {
      console.error("[v0] Erro de conexão:", error)
      alert("Erro de conexão. Certifique-se de que o backend está rodando em http://localhost:8080")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Converte datetime-local (2024-10-25T14:30) para o formato esperado (2024-10-25 14:30:00)
    const dataFormatada = formData.dataHora.replace("T", " ") + ":00"

    const payload = {
      idTransacao: formData.idTransacao,
      idConta: formData.idConta,
      dataHora: dataFormatada,
      tipoSaque: formData.tipoSaque,
      valorSaque: formData.valorSaque,
    }

    console.log("[v0] Enviando payload:", payload)

    try {
      const url = editingSaque
        ? `http://localhost:8080/api/saques/${editingSaque.idTransacao}`
        : "http://localhost:8080/api/saques"
      const method = editingSaque ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      console.log("[v0] Status da resposta:", response.status)

      if (response.ok) {
        alert(`Saque ${editingSaque ? "atualizado" : "criado"} com sucesso!`)
        fetchSaques()
        resetForm()
      } else {
        const errorText = await response.text()
        console.error("[v0] Erro do servidor:", errorText)
        alert(`Erro ao salvar saque: ${errorText}`)
      }
    } catch (error) {
      console.error("[v0] Erro de conexão:", error)
      alert("Erro de conexão com o servidor.")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este saque?")) return

    try {
      const response = await fetch(`http://localhost:8080/api/saques/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        alert("Saque excluído com sucesso!")
        fetchSaques()
      } else {
        alert("Erro ao excluir saque.")
      }
    } catch (error) {
      alert("Erro de conexão.")
    }
  }

  const resetForm = () => {
    setFormData({
      idTransacao: 0,
      valorSaque: 0,
      dataHora: "",
      idConta: 0,
      tipoSaque: "",
    })
    setEditingSaque(null)
    setShowForm(false)
  }

  const openEditForm = (saque: Saque) => {
    setEditingSaque(saque)
    // Converte "2024-10-25 14:30:00" para "2024-10-25T14:30" (formato datetime-local)
    const dataLocal = saque.dataHora.substring(0, 16).replace(" ", "T")
    setFormData({
      ...saque,
      dataHora: dataLocal,
    })
    setShowForm(true)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Carregando saques...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-xl p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Saques</h1>
            <p className="text-white/80">Gerencie os saques do sistema</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{saques.length}</div>
            <div className="text-white/80 text-sm">Total de saques</div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground">Lista de Saques</h2>
        <Button onClick={() => setShowForm(true)} className="bg-red-600 hover:bg-red-700 text-white shadow-lg gap-2">
          <ArrowUpCircle className="w-4 h-4" />
          Novo Saque
        </Button>
      </div>

      {showForm && (
        <Card className="card-shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-red-50 to-rose-50 border-b">
            <CardTitle className="text-xl">{editingSaque ? "Editar Saque" : "Novo Saque"}</CardTitle>
            <CardDescription>
              {editingSaque ? "Atualize as informações do saque" : "Preencha os dados do novo saque"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="idTransacao">ID Transação *</Label>
                  <Input
                    id="idTransacao"
                    type="number"
                    value={formData.idTransacao}
                    onChange={(e) => setFormData({ ...formData, idTransacao: Number.parseInt(e.target.value) || 0 })}
                    required
                    min="1"
                    disabled={!!editingSaque}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valorSaque">Valor do Saque *</Label>
                  <Input
                    id="valorSaque"
                    type="number"
                    step="0.01"
                    value={formData.valorSaque}
                    onChange={(e) => setFormData({ ...formData, valorSaque: Number.parseFloat(e.target.value) || 0 })}
                    required
                    min="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataHora">Data e Hora *</Label>
                  <Input
                    id="dataHora"
                    type="datetime-local"
                    value={formData.dataHora}
                    onChange={(e) => setFormData({ ...formData, dataHora: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idConta">ID da Conta *</Label>
                  <Input
                    id="idConta"
                    type="number"
                    value={formData.idConta}
                    onChange={(e) => setFormData({ ...formData, idConta: Number.parseInt(e.target.value) || 0 })}
                    required
                    min="1"
                  />
                  <p className="text-xs text-muted-foreground">A conta deve existir no sistema</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipoSaque">Tipo de Saque *</Label>
                  <Input
                    id="tipoSaque"
                    type="text"
                    value={formData.tipoSaque}
                    onChange={(e) => setFormData({ ...formData, tipoSaque: e.target.value })}
                    required
                    placeholder="Ex: Caixa eletrônico, Agência, etc."
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="bg-red-600 hover:bg-red-700 px-8">
                  {editingSaque ? "Atualizar" : "Criar"}
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="p-4 text-left text-sm font-semibold">ID Transação</th>
                <th className="p-4 text-left text-sm font-semibold">Valor</th>
                <th className="p-4 text-left text-sm font-semibold">Data</th>
                <th className="p-4 text-left text-sm font-semibold">ID Conta</th>
                <th className="p-4 text-left text-sm font-semibold">Tipo</th>
                <th className="p-4 text-left text-sm font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {saques.map((saque, index) => (
                <tr
                  key={saque.idTransacao}
                  className={`border-b border-border hover:bg-muted/30 transition-colors ${
                    index % 2 === 0 ? "bg-background" : "bg-muted/10"
                  }`}
                >
                  <td className="p-4">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm font-medium">
                      {saque.idTransacao}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-red-600">
                    {formatCurrency(saque.valorSaque)}
                  </td>
                  <td className="p-4 text-sm">{formatDate(saque.dataHora)}</td>
                  <td className="p-4">{saque.idConta}</td>
                  <td className="p-4 text-sm">{saque.tipoSaque}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditForm(saque)}
                        className="h-8 px-3 text-xs"
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(saque.idTransacao)}
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
          {saques.length === 0 && !loading && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowUpCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Nenhum saque encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Comece a primeiro saque ou verifique se o backend está rodando
              </p>
              <Button onClick={() => setShowForm(true)} className="bg-red-600 hover:bg-red-700">
                + Adicionar Saque
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
