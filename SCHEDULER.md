# 📅 SaaS Genie Scheduler

O SaaS Genie agora inclui um módulo de scheduler que permite executar o gerador de ideias automaticamente via cron job.

## 🚀 Como Usar

### 1. Configuração

Primeiro, configure as variáveis de ambiente no seu arquivo `.env`:

```bash
# Scheduler Configuration
SCHEDULER_ENABLED=true
SCHEDULER_CRON=0 9 * * *
SCHEDULER_TIMEZONE=America/Sao_Paulo
```

### 2. Modos de Execução

#### Modo Scheduler (Recomendado)
```bash
# Desenvolvimento
npm run dev:scheduler

# Produção
npm run start:scheduler
```

#### Outros Modos Disponíveis
```bash
# Execução única (padrão)
npm run dev
npm run start

# Execução em tempo real
npm run dev:realtime
npm run start:realtime

# Análise de tendências
npm run dev:analyze
npm run start:analyze
```

## ⏰ Configuração do Cron

### Expressões Cron Suportadas

O scheduler usa expressões cron padrão. Aqui estão alguns exemplos:

| Expressão | Descrição |
|-----------|-----------|
| `0 9 * * *` | Diariamente às 9:00 AM (padrão) |
| `0 8 * * 1-5` | Segunda a sexta às 8:00 AM |
| `0 */6 * * *` | A cada 6 horas |
| `0 0 * * 0` | Todo domingo à meia-noite |
| `30 14 * * *` | Diariamente às 14:30 |

### Sintaxe da Expressão Cron

```
* * * * *
│ │ │ │ │
│ │ │ │ └── Dia da semana (0-7, 0 e 7 = domingo)
│ │ │ └──── Mês (1-12)
│ │ └────── Dia do mês (1-31)
│ └──────── Hora (0-23)
└────────── Minuto (0-59)
```

## 🌍 Configuração de Fuso Horário

Configure o fuso horário usando a string de timezone padrão:

- `America/Sao_Paulo` - Horário de Brasília (padrão)
- `America/New_York` - Horário da Costa Leste dos EUA
- `Europe/London` - Horário de Londres
- `Asia/Tokyo` - Horário de Tóquio
- `UTC` - Tempo Universal Coordenado

## 🔧 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|---------|
| `SCHEDULER_ENABLED` | Habilita/desabilita o scheduler | `false` |
| `SCHEDULER_CRON` | Expressão cron para agendamento | `0 9 * * *` |
| `SCHEDULER_TIMEZONE` | Fuso horário para execução | `America/Sao_Paulo` |

## 📋 Exemplos de Configuração

### Execução Diária às 9h (Padrão)
```bash
SCHEDULER_ENABLED=true
SCHEDULER_CRON=0 9 * * *
SCHEDULER_TIMEZONE=America/Sao_Paulo
```

### Execução Duas Vezes por Dia
```bash
SCHEDULER_ENABLED=true
SCHEDULER_CRON=0 9,18 * * *
SCHEDULER_TIMEZONE=America/Sao_Paulo
```

### Execução Apenas em Dias Úteis
```bash
SCHEDULER_ENABLED=true
SCHEDULER_CRON=0 9 * * 1-5
SCHEDULER_TIMEZONE=America/Sao_Paulo
```

## 🛠️ Funcionalidades do Scheduler

### ✅ Características
- ✅ Execução automática baseada em cron
- ✅ Suporte a fusos horários
- ✅ Shutdown graceful (Ctrl+C)
- ✅ Logs detalhados de execução
- ✅ Status do scheduler em tempo real
- ✅ Configuração via variáveis de ambiente

### 📊 Monitoramento
O scheduler fornece logs detalhados:
- Status de inicialização
- Próxima execução agendada
- Logs de execução bem-sucedida/falhada
- Status periódico (a cada hora)

### 🔄 Shutdown Graceful
O scheduler suporta shutdown graceful:
- `Ctrl+C` (SIGINT)
- `SIGTERM`
- Para o cron job de forma segura
- Finaliza o processo limpo

## 🚨 Troubleshooting

### Problemas Comuns

1. **Scheduler não inicia**
   - Verifique se `SCHEDULER_ENABLED=true`
   - Confirme se a expressão cron é válida

2. **Execução não acontece no horário esperado**
   - Verifique o fuso horário configurado
   - Confirme se a expressão cron está correta

3. **Erro de timezone**
   - Use strings de timezone válidas (ex: `America/Sao_Paulo`)
   - Consulte a lista de timezones suportadas pelo Node.js

### Logs Úteis
```bash
# Para debug, monitore os logs
npm run dev:scheduler 2>&1 | tee scheduler.log
```

## 🔗 Integração com Sistema

### Como Serviço do Sistema (Linux/macOS)

1. **Crie um arquivo de serviço systemd:**
```ini
[Unit]
Description=SaaS Genie Scheduler
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/saas-genie
ExecStart=/usr/bin/node dist/index.js scheduler
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

2. **Ative o serviço:**
```bash
sudo systemctl enable saas-genie-scheduler
sudo systemctl start saas-genie-scheduler
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
CMD ["node", "dist/index.js", "scheduler"]
```

## 📈 Monitoramento e Alertas

Para ambientes de produção, considere:
- Configurar logs estruturados
- Implementar alertas para falhas
- Monitorar uso de recursos
- Configurar health checks

---

**🎉 Agora você tem um gerador de ideias SaaS que roda automaticamente todos os dias!**
