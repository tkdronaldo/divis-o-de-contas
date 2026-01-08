
import React, { useState, useMemo, useCallback } from 'react';
import { INITIAL_ACCOUNTS, ICONS } from './constants';
import { AccountType, Payer, Dependent } from './types';

const App: React.FC = () => {
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS.map(a => ({ ...a, value: 0 })));
  const [payers, setPayers] = useState<Payer[]>([]);
  const [newPayerName, setNewPayerName] = useState('');

  // Currency Formatter
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Logic to toggle account selection
  const toggleAccount = (id: string) => {
    setAccounts(prev => prev.map(acc => 
      acc.id === id ? { ...acc, selected: !acc.selected } : acc
    ));
  };

  // Update account value
  const updateAccountValue = (id: string, val: string) => {
    const numericValue = parseFloat(val.replace(',', '.')) || 0;
    setAccounts(prev => prev.map(acc => 
      acc.id === id ? { ...acc, value: numericValue } : acc
    ));
  };

  // Calculations
  const selectedAccounts = accounts.filter(a => a.selected);
  const totalCost = selectedAccounts.reduce((sum, acc) => sum + acc.value, 0);
  
  const totalPeopleCount = useMemo(() => {
    return payers.reduce((sum, p) => sum + 1 + p.dependents.length, 0);
  }, [payers]);

  const valuePerPerson = totalPeopleCount > 0 ? totalCost / totalPeopleCount : 0;

  // Payer Handlers
  const addPayer = () => {
    if (!newPayerName.trim()) return;
    const newPayer: Payer = {
      id: Math.random().toString(36).substr(2, 9),
      name: newPayerName.toUpperCase(),
      dependents: []
    };
    setPayers(prev => [...prev, newPayer]);
    setNewPayerName('');
  };

  const removePayer = (id: string) => {
    setPayers(prev => prev.filter(p => p.id !== id));
  };

  const addDependent = (payerId: string, name: string) => {
    if (!name.trim()) return;
    setPayers(prev => prev.map(p => {
      if (p.id === payerId) {
        return {
          ...p,
          dependents: [...p.dependents, { id: Math.random().toString(36).substr(2, 9), name: name.toUpperCase() }]
        };
      }
      return p;
    }));
  };

  const removeDependent = (payerId: string, depId: string) => {
    setPayers(prev => prev.map(p => {
      if (p.id === payerId) {
        return { ...p, dependents: p.dependents.filter(d => d.id !== depId) };
      }
      return p;
    }));
  };

  return (
    <div className="min-h-screen text-white p-4 md:p-8 max-w-5xl mx-auto space-y-6 pb-20">
      <header className="text-center space-y-2 mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Divisão de Contas</h1>
        <p className="text-gray-400 font-medium">Divida as despesas da casa de forma justa</p>
      </header>

      {/* 1. Seleção de Contas */}
      <section className="bg-[#24204b] rounded-xl p-6 shadow-xl border border-white/5">
        <div className="flex items-center gap-2 mb-6">
          <ICONS.LayoutGrid className="text-gray-400" size={20} />
          <h2 className="text-lg font-semibold">Selecione as Contas</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {accounts.map(acc => (
            <button
              key={acc.id}
              onClick={() => toggleAccount(acc.id)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 border-2 ${
                acc.selected 
                ? `${acc.color} border-white/20 scale-105 shadow-lg` 
                : 'bg-[#2d2b55] border-transparent hover:border-white/10 opacity-60'
              }`}
            >
              <div className="mb-2">{acc.icon}</div>
              <span className="text-[10px] font-bold uppercase tracking-wider mb-1">{acc.name}</span>
              <div className={`w-4 h-4 rounded-sm flex items-center justify-center border ${acc.selected ? 'bg-white/20 border-white' : 'border-gray-500'}`}>
                {acc.selected && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 2. Valores das Contas */}
      {selectedAccounts.length > 0 && (
        <section className="bg-[#24204b] rounded-xl p-6 shadow-xl border border-white/5">
          <h2 className="text-lg font-semibold mb-6">Valores das Contas</h2>
          <div className="space-y-3">
            {selectedAccounts.map(acc => (
              <div key={acc.id} className="flex items-center gap-4 bg-[#2d2b55] p-2 rounded-lg pr-4 border border-white/5">
                <div className={`${acc.color} p-2 rounded-lg shadow-inner`}>
                  {acc.icon}
                </div>
                <div className="flex-1 text-sm font-bold tracking-wide">{acc.name}</div>
                <div className="flex items-center gap-2 text-gray-300">
                  <span className="font-semibold">R$</span>
                  <input
                    type="number"
                    value={acc.value || ''}
                    placeholder="0"
                    onChange={(e) => updateAccountValue(acc.id, e.target.value)}
                    className="bg-[#1a1635] text-white font-bold py-1 px-3 rounded-md w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-between items-center border-t border-white/10 pt-4">
            <span className="text-gray-400 font-medium">Total das Contas:</span>
            <span className="text-3xl font-extrabold text-[#00f291]">
              {formatCurrency(totalCost)}
            </span>
          </div>
        </section>
      )}

      {/* 3. Pagadores e Dependentes */}
      <section className="bg-[#24204b] rounded-xl p-6 shadow-xl border border-white/5 space-y-6">
        <div className="flex items-center gap-2">
          <ICONS.Users className="text-gray-400" size={20} />
          <h2 className="text-lg font-semibold">Pagadores e Dependentes</h2>
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nome do pagador..."
            value={newPayerName}
            onChange={(e) => setNewPayerName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addPayer()}
            className="flex-1 bg-[#2d2b55] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-white/5"
          />
          <button 
            onClick={addPayer}
            className="bg-[#00f291] text-[#1a1635] font-bold px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[#00d17d] transition-colors"
          >
            <ICONS.Plus size={20} /> Adicionar
          </button>
        </div>

        <div className="space-y-6 mt-6">
          {payers.map(payer => (
            <div key={payer.id} className="bg-[#1a1635] rounded-xl p-6 border border-white/5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-xl text-white shadow-lg">
                    {payer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">{payer.name}</h3>
                    <p className="text-sm text-gray-400">{payer.dependents.length} dependentes</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2 text-gray-400 mb-1">
                    <span className="text-[10px] uppercase font-bold">Total a pagar</span>
                    <button onClick={() => removePayer(payer.id)} className="text-red-500 hover:bg-red-500/10 p-1 rounded transition-colors">
                      <ICONS.Trash2 size={18} />
                    </button>
                  </div>
                  <div className="text-2xl font-black text-[#00f291]">
                    {formatCurrency(valuePerPerson * (1 + payer.dependents.length))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center bg-[#2d2b55] px-4 py-2 rounded-lg">
                <span className="text-sm font-medium text-gray-300">Valor próprio:</span>
                <span className="font-bold text-lg">{formatCurrency(valuePerPerson)}</span>
              </div>

              {payer.dependents.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Dependentes:</p>
                  {payer.dependents.map(dep => (
                    <div key={dep.id} className="flex items-center justify-between bg-[#2d2b55]/50 px-4 py-2 rounded-lg border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-bold">
                          {dep.name.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold">{dep.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-emerald-400 font-bold">{formatCurrency(valuePerPerson)}</span>
                        <button onClick={() => removeDependent(payer.id, dep.id)} className="text-red-500 hover:text-red-400">
                          <ICONS.Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <DependentInput payerId={payer.id} onAdd={addDependent} />
            </div>
          ))}
        </div>
      </section>

      {/* 4. Resumo da Divisão */}
      {payers.length > 0 && (
        <section className="bg-[#24204b] rounded-xl p-6 shadow-xl border border-white/5 space-y-8">
          <div className="flex items-center gap-2 mb-4">
            <ICONS.Calculator className="text-gray-400" size={20} />
            <h2 className="text-lg font-semibold tracking-tight">Resumo da Divisão</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#1a1635] p-6 rounded-xl border border-white/5 text-center space-y-1">
              <p className="text-xs font-bold text-gray-500 uppercase">Total Contas</p>
              <p className="text-2xl font-black">{formatCurrency(totalCost)}</p>
            </div>
            <div className="bg-[#1a1635] p-6 rounded-xl border border-white/5 text-center space-y-1">
              <p className="text-xs font-bold text-gray-500 uppercase">Pessoas</p>
              <p className="text-2xl font-black">{totalPeopleCount}</p>
            </div>
            <div className="bg-[#1a1635] p-6 rounded-xl border border-white/5 text-center space-y-1">
              <p className="text-xs font-bold text-gray-500 uppercase">Por Pessoa</p>
              <p className="text-2xl font-black text-[#00f291]">{formatCurrency(valuePerPerson)}</p>
            </div>
          </div>

          <div className="space-y-2">
            {payers.map(payer => (
              <div key={payer.id} className="bg-[#1a1635] flex items-center justify-between px-6 py-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-sm">
                    {payer.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold">{payer.name}</span>
                    <span className="text-gray-400 text-sm ml-2">({payer.dependents.length + 1} pessoa{payer.dependents.length === 0 ? '' : 's'})</span>
                  </div>
                </div>
                <div className="text-[#00f291] font-black text-xl">
                  {formatCurrency(valuePerPerson * (1 + payer.dependents.length))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Exportar e Compartilhar */}
      <section className="bg-[#24204b] rounded-xl p-6 shadow-xl border border-white/5 space-y-6">
        <div className="flex items-center gap-2">
          <ICONS.Share2 className="text-gray-400" size={20} />
          <h2 className="text-lg font-semibold">Exportar e Compartilhar</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center gap-2 bg-red-500 hover:bg-red-600 p-4 rounded-xl font-bold transition-all shadow-lg active:scale-95">
            <ICONS.FileText size={24} />
            <span className="text-xs">Exportar PDF</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 p-4 rounded-xl font-bold transition-all shadow-lg active:scale-95">
            <ICONS.Camera size={24} />
            <span className="text-xs">Capturar PNG</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 p-4 rounded-xl font-bold transition-all shadow-lg active:scale-95">
            <ICONS.MessageCircle size={24} />
            <span className="text-xs">WhatsApp</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 p-4 rounded-xl font-bold transition-all shadow-lg active:scale-95">
            <ICONS.Mail size={24} />
            <span className="text-xs">E-mail</span>
          </button>
        </div>
      </section>

      <footer className="text-center text-gray-500 text-xs py-8">
        Divisão de Contas &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

// Helper component for adding dependents to keep state local
interface DependentInputProps {
  payerId: string;
  onAdd: (payerId: string, name: string) => void;
}

const DependentInput: React.FC<DependentInputProps> = ({ payerId, onAdd }) => {
  const [name, setName] = useState('');

  const handleAdd = () => {
    onAdd(payerId, name);
    setName('');
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Nome do dependente..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        className="flex-1 bg-[#2d2b55] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 border border-white/5"
      />
      <button 
        onClick={handleAdd}
        className="bg-purple-600 hover:bg-purple-700 p-2 rounded-lg text-white shadow-lg transition-colors"
      >
        <ICONS.UserPlus size={18} />
      </button>
    </div>
  );
};

export default App;
