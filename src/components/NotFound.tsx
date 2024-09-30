import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertCircle className="w-8 h-8 mr-2" />
            <h4 className="text-2xl font-semibold tracking-tight">Address Not Found</h4>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            We couldn&#39;t find the blockchain address you&#39;re looking for. This could be
            because:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6">
            <li>The address you entered doesn&#39;t exist</li>
            <li>There was a typo in the address</li>
            <li>The address hasn&#39;t had any transactions yet</li>
          </ul>
          <p className="text-gray-600 mb-6">Please double-check the address and try again.</p>
        </CardContent>
      </Card>
    </div>
  )
}
