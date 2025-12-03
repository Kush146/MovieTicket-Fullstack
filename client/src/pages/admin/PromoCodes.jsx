import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import Title from '../../components/admin/Title'
import Loading from '../../components/Loading'
import toast from 'react-hot-toast'
import { Plus, Edit, Trash2, X, Check, Calendar, Percent, DollarSign } from 'lucide-react'

const PromoCodes = () => {
  const { axios, getToken } = useAppContext()
  const [promoCodes, setPromoCodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCode, setEditingCode] = useState(null)
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: 0,
    minAmount: 0,
    maxDiscount: null,
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: '',
    usageLimit: null,
    isActive: true,
    description: ''
  })

  const fetchPromoCodes = async () => {
    try {
      const { data } = await axios.get('/api/admin/promo-codes', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        setPromoCodes(data.promoCodes)
      }
      setLoading(false)
    } catch {
      toast.error('Failed to fetch promo codes')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPromoCodes()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingCode 
        ? `/api/admin/promo-codes/${editingCode._id}`
        : '/api/admin/promo-codes'
      
      const method = editingCode ? 'put' : 'post'
      
      const { data } = await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      
      if (data.success) {
        toast.success(editingCode ? 'Promo code updated' : 'Promo code created')
        setShowModal(false)
        setEditingCode(null)
        setFormData({
          code: '',
          discountType: 'PERCENTAGE',
          discountValue: 0,
          minAmount: 0,
          maxDiscount: null,
          validFrom: new Date().toISOString().split('T')[0],
          validUntil: '',
          usageLimit: null,
          isActive: true,
          description: ''
        })
        fetchPromoCodes()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save promo code')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this promo code?')) return
    
    try {
      const { data } = await axios.delete(`/api/admin/promo-codes/${id}`, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        toast.success('Promo code deleted')
        fetchPromoCodes()
      }
    } catch {
      toast.error('Failed to delete promo code')
    }
  }

  const handleEdit = (code) => {
    setEditingCode(code)
    setFormData({
      code: code.code,
      discountType: code.discountType,
      discountValue: code.discountValue,
      minAmount: code.minAmount || 0,
      maxDiscount: code.maxDiscount || null,
      validFrom: new Date(code.validFrom).toISOString().split('T')[0],
      validUntil: new Date(code.validUntil).toISOString().split('T')[0],
      usageLimit: code.usageLimit || null,
      isActive: code.isActive,
      description: code.description || ''
    })
    setShowModal(true)
  }

  const getStatusBadge = (code) => {
    const now = new Date()
    const validUntil = new Date(code.validUntil)
    
    if (!code.isActive) {
      return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs">Inactive</span>
    }
    
    if (now > validUntil) {
      return <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">Expired</span>
    }
    
    if (code.usageLimit && code.usedCount >= code.usageLimit) {
      return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">Limit Reached</span>
    }
    
    return <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">Active</span>
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Title text1="Promo" text2="Codes" />
        <button
          onClick={() => {
            setEditingCode(null)
            setFormData({
              code: '',
              discountType: 'PERCENTAGE',
              discountValue: 0,
              minAmount: 0,
              maxDiscount: null,
              validFrom: new Date().toISOString().split('T')[0],
              validUntil: '',
              usageLimit: null,
              isActive: true,
              description: ''
            })
            setShowModal(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Add Promo Code
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="mt-6">
          {promoCodes.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Plus className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No promo codes found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Code</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Discount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Min Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Valid Until</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Usage</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {promoCodes.map((code) => (
                    <tr key={code._id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4">
                        <span className="font-mono font-semibold">{code.code}</span>
                      </td>
                      <td className="py-3 px-4">
                        {code.discountType === 'PERCENTAGE' ? (
                          <span className="flex items-center gap-1 text-sm">
                            <Percent className="w-4 h-4" />
                            Percentage
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-sm">
                            <DollarSign className="w-4 h-4" />
                            Fixed
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {code.discountType === 'PERCENTAGE' 
                          ? `${code.discountValue}%${code.maxDiscount ? ` (max $${code.maxDiscount})` : ''}`
                          : `$${code.discountValue}`
                        }
                      </td>
                      <td className="py-3 px-4">${code.minAmount || 0}</td>
                      <td className="py-3 px-4 text-sm">
                        {new Date(code.validUntil).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {code.usedCount || 0} / {code.usageLimit || '∞'}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(code)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(code)}
                            className="p-2 hover:bg-white/10 rounded transition"
                          >
                            <Edit className="w-4 h-4 text-blue-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(code._id)}
                            className="p-2 hover:bg-white/10 rounded transition"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/10 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingCode ? 'Edit Promo Code' : 'Create Promo Code'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false)
                  setEditingCode(null)
                }}
                className="text-white/60 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="WELCOME10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Discount Type *</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="PERCENTAGE">Percentage</option>
                    <option value="FIXED">Fixed Amount</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Discount Value * {formData.discountType === 'PERCENTAGE' ? '(%)' : '($)'}
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step={formData.discountType === 'PERCENTAGE' ? '1' : '0.01'}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({...formData, discountValue: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {formData.discountType === 'PERCENTAGE' && (
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Max Discount ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.maxDiscount || ''}
                      onChange={(e) => setFormData({...formData, maxDiscount: e.target.value ? parseFloat(e.target.value) : null})}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Optional"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Minimum Amount ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.minAmount}
                    onChange={(e) => setFormData({...formData, minAmount: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Usage Limit</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usageLimit || ''}
                    onChange={(e) => setFormData({...formData, usageLimit: e.target.value ? parseInt(e.target.value) : null})}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Unlimited"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Valid From *</label>
                  <input
                    type="date"
                    required
                    value={formData.validFrom}
                    onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Valid Until *</label>
                  <input
                    type="date"
                    required
                    value={formData.validUntil}
                    onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="3"
                  placeholder="Optional description"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="isActive" className="text-sm text-white/80">Active</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                >
                  {editingCode ? 'Update' : 'Create'} Promo Code
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingCode(null)
                  }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default PromoCodes

