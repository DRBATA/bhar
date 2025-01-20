import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import prisma from '@/lib/prisma'

export default async function SessionsPage() {
  const session = await getServerSession()
  
  if (!session?.user) {
    redirect('/login')
  }

  // Fetch upcoming sessions
  const upcomingSessions = await prisma.session.findMany({
    where: {
      date: {
        gte: new Date()
      }
    },
    orderBy: {
      date: 'asc'
    }
  })

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Yacht Sessions</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create New Session
        </button>
      </div>

      {/* Session Creation Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create Session</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input 
              type="date" 
              className="w-full p-2 border rounded"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Is Weekend?</label>
            <select className="w-full p-2 border rounded">
              <option value="false">No (6 AM - 9 AM)</option>
              <option value="true">Yes (9 AM - 12 PM)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ice Bath Slots</label>
            <input 
              type="number" 
              className="w-full p-2 border rounded"
              defaultValue={9}
              min={0}
              max={9}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Reflexology Slots</label>
            <input 
              type="number" 
              className="w-full p-2 border rounded"
              defaultValue={9}
              min={0}
              max={9}
            />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Create Session
            </button>
          </div>
        </form>
      </div>

      {/* Sessions List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available Slots</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ice Bath</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reflexology</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {upcomingSessions.map((session) => (
              <tr key={session.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(session.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {session.isWeekend ? '9 AM - 12 PM' : '6 AM - 9 AM'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {session.availableSlots}/{session.capacity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {session.iceSlots} slots
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {session.reflexSlots} slots
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
