import React, { useState, useEffect } from 'react';
import { createReservation, getLitters, getClients, createClient } from '../services/reservationService';

const ReservationModal = ({ isOpen, onClose, onSuccess }) => {
    const [litters, setLitters] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [useExistingClient, setUseExistingClient] = useState(false);

    const [formData, setFormData] = useState({
        // Cliente info
        client_id: '',
        client_name: '',
        cpf: '',
        rg: '',
        phone: '',
        email: '',
        zipcode: '',
        address: '',
        address_number: '',
        neighborhood: '',
        city: '',
        state: '',

        // Reserva info
        litter_id: '',
        choice_gender: 'male',
        preferred_color: '',
        puppy_code: '', // Será preenchido depois

        // Valores
        total_value: '',
        deposit_value: '',
        deposit_paid: false,
        payment_method: '',

        // Preferências adicionais
        temperament_preference: 'no_preference',
        purpose: 'companion',
        additional_notes: ''
    });

    useEffect(() => {
        if (isOpen) {
            loadData();
        }
    }, [isOpen]);

    const loadData = async () => {
        try {
            const [littersData, clientsData] = await Promise.all([
                getLitters(),
                getClients()
            ]);
            setLitters(littersData);
            setClients(clientsData);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleClientSelect = (e) => {
        const clientId = e.target.value;
        if (clientId) {
            const selectedClient = clients.find(c => c.id === parseInt(clientId));
            if (selectedClient) {
                setFormData({
                    ...formData,
                    client_id: selectedClient.id,
                    client_name: selectedClient.name,
                    cpf: selectedClient.cpf || '',
                    phone: selectedClient.phone || '',
                    email: selectedClient.email || '',
                    zipcode: selectedClient.zipcode || '',
                    address: selectedClient.address || '',
                    city: selectedClient.city || '',
                    state: selectedClient.state || ''
                });
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let clientId = formData.client_id;

            // Se não estiver usando cliente existente, criar novo
            if (!useExistingClient || !clientId) {
                const newClient = await createClient({
                    name: formData.client_name,
                    cpf: formData.cpf,
                    phone: formData.phone,
                    email: formData.email,
                    zipcode: formData.zipcode,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    type: 'waiting_list',
                    notes: `Número: ${formData.address_number}, Bairro: ${formData.neighborhood}`
                });
                clientId = newClient.id;
            }

            // Criar reserva
            const reservationData = {
                client_id: clientId,
                reservation_type: 'litter_choice',
                litter_id: formData.litter_id,
                choice_gender: formData.choice_gender,
                choice_priority: `Escolha ${formData.choice_gender === 'male' ? 'Macho' : 'Fêmea'}`,
                total_value: parseFloat(formData.total_value) || null,
                deposit_value: parseFloat(formData.deposit_value) || 0,
                deposit_paid: formData.deposit_paid,
                payment_method: formData.payment_method || null,
                status: formData.deposit_paid ? 'confirmed' : 'awaiting_deposit',
                notes: formData.additional_notes,
                preferences: {
                    preferred_gender: formData.choice_gender,
                    preferred_color: formData.preferred_color,
                    temperament_preference: formData.temperament_preference,
                    purpose: formData.purpose,
                    additional_notes: formData.additional_notes
                }
            };

            await createReservation(reservationData);

            onSuccess();
            handleClose();
        } catch (error) {
            console.error('Erro ao criar reserva:', error);
            alert('Erro ao criar reserva: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            client_id: '',
            client_name: '',
            cpf: '',
            rg: '',
            phone: '',
            email: '',
            zipcode: '',
            address: '',
            address_number: '',
            neighborhood: '',
            city: '',
            state: '',
            litter_id: '',
            choice_gender: 'male',
            preferred_color: '',
            puppy_code: '',
            total_value: '',
            deposit_value: '',
            deposit_paid: false,
            payment_method: '',
            temperament_preference: 'no_preference',
            purpose: 'companion',
            additional_notes: ''
        });
        setUseExistingClient(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Nova Reserva</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Seleção de Ninhada - OBRIGATÓRIO */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            <span className="material-symbols-outlined align-middle mr-2">pets</span>
                            Ninhada
                        </h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Selecionar Ninhada <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="litter_id"
                                value={formData.litter_id}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            >
                                <option value="">Selecione uma ninhada...</option>
                                {litters.map(litter => (
                                    <option key={litter.id} value={litter.id}>
                                        {litter.name || `Ninhada #${litter.id}`}
                                        {' - '}
                                        Disponíveis: {litter.available_males}M / {litter.available_females}F
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Toggle Cliente Existente */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="useExistingClient"
                            checked={useExistingClient}
                            onChange={(e) => setUseExistingClient(e.target.checked)}
                            className="w-4 h-4"
                        />
                        <label htmlFor="useExistingClient" className="text-sm font-medium text-gray-700">
                            Cliente já cadastrado?
                        </label>
                    </div>

                    {useExistingClient && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Selecionar Cliente
                            </label>
                            <select
                                onChange={handleClientSelect}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            >
                                <option value="">Selecione um cliente...</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>
                                        {client.name} - {client.email || client.phone}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Dados Pessoais */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Pessoais</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nome Completo <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="client_name"
                                    value={formData.client_name}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    placeholder="Lukas Junior Weber Grassiani"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        CPF
                                    </label>
                                    <input
                                        type="text"
                                        name="cpf"
                                        value={formData.cpf}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        placeholder="000.000.000-00"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        RG
                                    </label>
                                    <input
                                        type="text"
                                        name="rg"
                                        value={formData.rg}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        placeholder="0000000000"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contato */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contato</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Telefone com WhatsApp <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    placeholder="(54) 99215-1511"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    E-mail <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    placeholder="lukasweber350@gmail.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Endereço */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Endereço</h3>

                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        CEP
                                    </label>
                                    <input
                                        type="text"
                                        name="zipcode"
                                        value={formData.zipcode}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        placeholder="95185-000"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rua
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        placeholder="Ampélio Carlotto"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Número
                                    </label>
                                    <input
                                        type="text"
                                        name="address_number"
                                        value={formData.address_number}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        placeholder="546"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bairro
                                    </label>
                                    <input
                                        type="text"
                                        name="neighborhood"
                                        value={formData.neighborhood}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        placeholder="Aurora"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cidade
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        placeholder="Carlos Barbosa"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    UF
                                </label>
                                <select
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                >
                                    <option value="">Selecione...</option>
                                    <option value="RS">RS</option>
                                    <option value="SC">SC</option>
                                    <option value="PR">PR</option>
                                    <option value="SP">SP</option>
                                    <option value="RJ">RJ</option>
                                    <option value="MG">MG</option>
                                    {/* Adicionar outros estados conforme necessário */}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Filhote / Preferências */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferências do Filhote</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Sexo <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-6">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="choice_gender"
                                            value="male"
                                            checked={formData.choice_gender === 'male'}
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        Macho
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="choice_gender"
                                            value="female"
                                            checked={formData.choice_gender === 'female'}
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        Fêmea
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Coloração Preferida
                                </label>
                                <input
                                    type="text"
                                    name="preferred_color"
                                    value={formData.preferred_color}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    placeholder="Ex: Capa Preta, Preto Sólido, etc."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Temperamento Preferido
                                </label>
                                <select
                                    name="temperament_preference"
                                    value={formData.temperament_preference}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                >
                                    <option value="no_preference">Sem preferência</option>
                                    <option value="calm">Calmo</option>
                                    <option value="active">Ativo</option>
                                    <option value="balanced">Equilibrado</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Finalidade
                                </label>
                                <select
                                    name="purpose"
                                    value={formData.purpose}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                >
                                    <option value="companion">Companhia</option>
                                    <option value="guard">Guarda</option>
                                    <option value="show">Exposição</option>
                                    <option value="breeding">Reprodução</option>
                                    <option value="sport">Esporte</option>
                                    <option value="other">Outro</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Código do Filhote
                                </label>
                                <input
                                    type="text"
                                    name="puppy_code"
                                    value={formData.puppy_code}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                                    placeholder="Será preenchido pelo canil após a escolha"
                                    disabled
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Este campo será preenchido pelo canil após a escolha do filhote
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Valores Financeiros */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Valores</h3>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Valor Total do Cão
                                    </label>
                                    <input
                                        type="number"
                                        name="total_value"
                                        value={formData.total_value}
                                        onChange={handleChange}
                                        step="0.01"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        placeholder="5000.00"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Valor do Sinal <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="deposit_value"
                                        value={formData.deposit_value}
                                        onChange={handleChange}
                                        required
                                        step="0.01"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        placeholder="1000.00"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Método de Pagamento
                                </label>
                                <select
                                    name="payment_method"
                                    value={formData.payment_method}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                >
                                    <option value="">Selecione...</option>
                                    <option value="pix">PIX</option>
                                    <option value="credit_card">Cartão de Crédito</option>
                                    <option value="bank_transfer">Transferência Bancária</option>
                                    <option value="cash">Dinheiro</option>
                                    <option value="other">Outro</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="deposit_paid"
                                    name="deposit_paid"
                                    checked={formData.deposit_paid}
                                    onChange={handleChange}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="deposit_paid" className="text-sm font-medium text-gray-700">
                                    Sinal já foi recebido
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Observações */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Observações Adicionais
                        </label>
                        <textarea
                            name="additional_notes"
                            value={formData.additional_notes}
                            onChange={handleChange}
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            placeholder="Informações adicionais sobre a reserva..."
                        />
                    </div>

                    {/* Botões */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="btn-ghost"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">save</span>
                                    Criar Reserva
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReservationModal;
