import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Filter, Mail, Phone, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthImage } from "@/hooks/use-auth-image";
import { authStorage, getSecureImageUrl } from "@/lib/auth";

interface Employee {
  id: string;
  name: string;
  jobTitle: string;
  email: string;
  phone: string;
  imageUrl?: string;
}

interface OrgChartEmployee {
  id: string;
  name: string;
  job: string;
  type: string;
  level: number;
  image_url: string;
}

interface ApiEmployee {
  id: number;
  name: string;
  job_title: string;
  work_email: string;
  work_phone: string | false;
  mobile_phone: string | false;
  image_url: string;
}

// Employee card component to handle individual image loading
const EmployeeCard = ({ employee, onClick }: { employee: Employee; onClick: () => void }) => {
  const { blobUrl } = useAuthImage(employee.imageUrl);

  return (
    <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow bg-card" onClick={onClick}>
      <div className="flex gap-4">
        <Avatar className="h-24 w-24 shrink-0">
          <AvatarImage src={blobUrl} alt={employee.name} className="object-cover" />
          <AvatarFallback className="bg-slate-800 text-primary text-2xl">
            {employee.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-center min-w-0 flex-1">
          <h3 className="font-semibold text-foreground text-lg leading-tight mb-1">{employee.name}</h3>
          <p className="text-muted-foreground text-sm mb-3">{employee.jobTitle}</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <span className="truncate">{employee.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <span>{employee.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const BATCH_SIZE = 50;

const Employee360 = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [childEmployeeIds, setChildEmployeeIds] = useState<number[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalEmployees, setTotalEmployees] = useState(0);

  // Fetch child employee IDs on mount
  useEffect(() => {
    const fetchChildIds = async () => {
      try {
        setLoading(true);
        setError(null);

        const authData = authStorage.getAuthData();
        const headers = authStorage.getAuthHeaders();

        if (!authData?.employee_id) {
          throw new Error("No employee ID found");
        }

        const orgChartResponse = await fetch(`https://bsnswheel.org/api/v1/org_chart/custom/${authData.employee_id}`, {
          method: "PUT",
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
        });

        if (!orgChartResponse.ok) {
          throw new Error("Failed to fetch org chart");
        }

        const orgChartData = await orgChartResponse.json();
        const childIds = (orgChartData.result as OrgChartEmployee[])
          .filter((emp) => emp.type === "child")
          .map((emp) => parseInt(emp.id));

        console.log("Child employee IDs:", childIds);

        if (childIds.length === 0) {
          setEmployees([]);
          setLoading(false);
          setHasMore(false);
          return;
        }

        setChildEmployeeIds(childIds);
        setTotalEmployees(childIds.length);
      } catch (err) {
        console.error("Error fetching org chart:", err);
        setError(err instanceof Error ? err.message : "Failed to load employees");
        setLoading(false);
      }
    };

    fetchChildIds();
  }, []);

  // Fetch employees batch when childEmployeeIds are available or offset changes
  // Keeps fetching until at least one match is found or no more data
  const fetchEmployeesBatch = async (currentOffset: number, isInitial: boolean = false) => {
    if (childEmployeeIds.length === 0) return;

    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const headers = authStorage.getAuthHeaders();
      let searchOffset = currentOffset;
      let foundEmployees: Employee[] = [];
      let moreDataAvailable = true;

      // Keep fetching until we find at least one match or exhaust all data
      while (foundEmployees.length === 0 && moreDataAvailable) {
        const employeesResponse = await fetch(
          `https://bsnswheel.org/api/v1/employees?offset=${searchOffset}&limit=${BATCH_SIZE}`,
          {
            method: "GET",
            headers,
          },
        );

        if (!employeesResponse.ok) {
          throw new Error("Failed to fetch employees");
        }

        const employeesData = await employeesResponse.json();
        const allResults = employeesData.results as ApiEmployee[];

        // Filter employees by child IDs
        const managedEmployees = allResults
          .filter((emp) => childEmployeeIds.includes(emp.id))
          .map((emp) => ({
            id: emp.id.toString(),
            name: emp.name,
            jobTitle: emp.job_title || "",
            email: emp.work_email || "",
            phone: emp.work_phone || emp.mobile_phone || "",
            imageUrl: getSecureImageUrl(emp.image_url),
          }));

        foundEmployees = managedEmployees;
        searchOffset += BATCH_SIZE;
        
        const totalFromApi = employeesData.total || allResults.length;
        moreDataAvailable = searchOffset < totalFromApi;

        console.log(
          `Fetched batch: offset=${searchOffset - BATCH_SIZE}, found=${managedEmployees.length}, moreDataAvailable=${moreDataAvailable}`,
        );
      }

      setEmployees((prev) => (isInitial ? foundEmployees : [...prev, ...foundEmployees]));
      setHasMore(moreDataAvailable);
      setOffset(searchOffset);
    } catch (err) {
      console.error("Error fetching employees batch:", err);
      setError(err instanceof Error ? err.message : "Failed to load employees");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial fetch when childEmployeeIds become available
  useEffect(() => {
    if (childEmployeeIds.length > 0) {
      fetchEmployeesBatch(0, true);
    }
  }, [childEmployeeIds]);

  const handleLoadMore = () => {
    fetchEmployeesBatch(offset, false);
  };

  const handleEmployeeClick = (employeeId: string) => {
    navigate(`/employee/${employeeId}`);
  };

  return (
    <div className="min-h-screen bg-background max-w-screen-xl mx-auto">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/modules")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">{t("employee360.title")}</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(!isFilterOpen)}>
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Employee List */}
      <main className="px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-destructive">{error}</div>
        ) : employees.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {t("employee360.noEmployees") || "No employees found"}
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-2">
              {t("employee360.showing") || "Showing"} {employees.length} {t("employee360.of") || "of"} {totalEmployees}{" "}
              {t("employee360.employees") || "employees"}
            </p>
            {employees.map((employee) => (
              <EmployeeCard key={employee.id} employee={employee} onClick={() => handleEmployeeClick(employee.id)} />
            ))}
            {hasMore && (
              <Button variant="outline" className="w-full mt-4" onClick={handleLoadMore} disabled={loadingMore}>
                {loadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {t("employee360.loading") || "Loading..."}
                  </>
                ) : (
                  t("employee360.loadMore") || "Load More"
                )}
              </Button>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Employee360;
