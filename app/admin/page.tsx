import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

export default async function AdminPage() {
  const session = await getServerSession()
  
  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sessions Management */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Yacht Sessions</h2>
          <p className="text-gray-600 mb-4">Manage upcoming yacht sessions, capacity, and activities</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Manage Sessions
          </button>
        </div>

        {/* Bookings Management */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Bookings</h2>
          <p className="text-gray-600 mb-4">View and manage customer bookings and packages</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            View Bookings
          </button>
        </div>

        {/* Pricing Configuration */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Pricing</h2>
          <p className="text-gray-600 mb-4">Configure prices for packages, drinks, and add-ons</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Update Prices
          </button>
        </div>

        {/* User Management */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <p className="text-gray-600 mb-4">Manage user accounts and memberships</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Manage Users
          </button>
        </div>

        {/* Reports */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Reports</h2>
          <p className="text-gray-600 mb-4">View booking statistics and revenue reports</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            View Reports
          </button>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Settings</h2>
          <p className="text-gray-600 mb-4">Configure system settings and preferences</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Edit Settings
          </button>
        </div>
      </div>
    </div>
  )
}
