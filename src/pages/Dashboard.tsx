import { Card } from "@/components/ui/card";
import { authStorage } from "@/lib/auth";
import nocLogo from "@/assets/noc-logo.png";

const Dashboard = () => {
  const authData = authStorage.getAuthData();
  const employeeData = authStorage.getEmployeeData();
  
  const user = {
    name: employeeData?.name || "User",
    email: employeeData?.email || "",
    image: employeeData?.image,
    employeeId: authData?.employee_id,
    userId: authData?.user_id,
    isManager: authData?.is_manager,
  };

  const myListItems = [
    { icon: "👤", title: "My Profile", color: "bg-purple-100" },
    { icon: "📋", title: "My Requests", color: "bg-purple-100" },
    { icon: "⭐", title: "Appraisals", color: "bg-purple-100" },
    { icon: "💰", title: "Payslips", color: "bg-red-100" },
    { icon: "📊", title: "Activities", color: "bg-blue-100" },
    { icon: "📍", title: "Work Location Plans", color: "bg-blue-100" },
    { icon: "📅", title: "Planning", color: "bg-purple-100" },
    { icon: "👥", title: "Team Time Off", color: "bg-blue-100" },
    { icon: "🏖️", title: "MY Time Off", color: "bg-cyan-100" },
    { icon: "✅", title: "Attendance", color: "bg-green-100" },
    { icon: "💳", title: "Expenses", color: "bg-orange-100" },
    { icon: "📝", title: "Attendance Approval Request", color: "bg-blue-100" },
    { icon: "📄", title: "Documents", color: "bg-purple-100" },
    { icon: "🌐", title: "Projects", color: "bg-cyan-100" },
  ];

  const myTeamItems = [
    { icon: "✓", title: "Approvals", color: "bg-blue-100" },
    { icon: "📋", title: "Approvals to Review", color: "bg-green-100" },
    { icon: "📊", title: "Time Off Analysis", color: "bg-blue-100" },
    { icon: "📁", title: "Document Folders", color: "bg-orange-100" },
  ];

  const othersItems = [
    { icon: "🛍️", title: "Sales Orders", subtitle: "Follow, view or pay your orders", color: "bg-blue-100" },
    { icon: "📄", title: "Your Invoices", subtitle: "Follow, download or pay your invoices", color: "bg-purple-100" },
    { icon: "📁", title: "Projects", subtitle: "Follow the evolution of your projects", color: "bg-orange-100" },
    { icon: "📋", title: "Tasks", subtitle: "Follow and comments tasks of your projects", color: "bg-blue-100" },
    { icon: "⏰", title: "Timesheets", subtitle: "Review all timesheets related to your projects", color: "bg-gray-100" },
    { icon: "🔒", title: "Connection & Security", subtitle: "Configure your connection parameters", color: "bg-blue-100" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <img src={nocLogo} alt="National Oil Corporation" className="h-16 w-auto" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-foreground">English (US)</span>
            <span className="text-foreground font-medium">{user.name}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-4xl font-bold text-foreground">My account</h1>
          
          {/* User Info Card */}
          <Card className="p-6 w-80">
            <div className="flex items-center gap-4 mb-4">
              {user.image ? (
                <img 
                  src={user.image} 
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl">
                  👤
                </div>
              )}
              <div>
                <h2 className="font-semibold text-lg text-foreground">{user.name}</h2>
              </div>
            </div>
            <p className="text-muted-foreground mb-2">✉️ {user.email}</p>
            <a href="#" className="text-primary hover:underline text-sm">✏️ Edit information</a>
          </Card>
        </div>

        {/* My List Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">My List</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {myListItems.map((item, index) => (
              <Card 
                key={index} 
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center text-2xl`}>
                    {item.icon}
                  </div>
                  <h3 className="font-medium text-foreground">{item.title}</h3>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* My Team Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">My Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {myTeamItems.map((item, index) => (
              <Card 
                key={index} 
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center text-2xl`}>
                    {item.icon}
                  </div>
                  <h3 className="font-medium text-foreground">{item.title}</h3>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Others Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Others</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {othersItems.map((item, index) => (
              <Card 
                key={index} 
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">{item.title}</h3>
                    {item.subtitle && (
                      <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-secondary mt-16 -mx-6 px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4 text-foreground">Useful Links</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Home</a></li>
                <li><a href="#" className="hover:text-foreground">Courses</a></li>
                <li><a href="#" className="hover:text-foreground">Events</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4 text-foreground">About NOC</h3>
              <p className="text-muted-foreground text-sm">
                The National Oil Corporation (NOC) of Libya is responsible for overseeing and managing the 
                country's oil and gas sector. Established on November 12, 1970, NOC engages in exploration, 
                production, refining, marketing, and distribution of oil and gas through its affiliated companies 
                and partnerships with international corporations. NOC aims to support the national economy by 
                maximizing returns from Libya's oil and gas reserves while ensuring sustainable and responsible operations.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground text-sm">
            <p>Copyright © Company name | العربية | English (US)</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;

