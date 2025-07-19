import { Check } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PricingPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Pricing Plans for Recruiters</h1>
          <p className="mt-4 text-xl text-gray-500">Choose the perfect plan for your recruitment needs</p>
        </div>

        {/* Pricing Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="monthly" className="mx-auto max-w-3xl">
            <div className="flex justify-center">
              <TabsList className="grid w-[400px] grid-cols-2">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="annual">Annual (Save 20%)</TabsTrigger>
              </TabsList>
            </div>

            {/* Monthly Plans */}
            <TabsContent value="monthly">
              <div className="mt-12 space-y-4 sm:mt-16 sm:grid sm:grid-cols-3 sm:gap-6 sm:space-y-0 lg:mx-auto lg:max-w-5xl">
                {/* Basic Plan */}
                <Card className="flex flex-col divide-y divide-gray-200 rounded-lg shadow-lg">
                  <CardHeader className="flex-1 p-6">
                    <CardTitle className="text-2xl font-bold text-gray-900">Basic</CardTitle>
                    <CardDescription className="mt-2">For small businesses and startups</CardDescription>
                    <div className="mt-4 flex items-baseline text-gray-900">
                      <span className="text-4xl font-bold tracking-tight">$49</span>
                      <span className="ml-1 text-xl font-semibold">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col justify-between p-6">
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">3 job postings</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">30 days visibility</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">Basic candidate filtering</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">Email support</p>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter className="p-6">
                    <Button className="w-full" size="lg">
                      <Link href="/auth/register">Get Started</Link>
                    </Button>
                  </CardFooter>
                </Card>

                {/* Professional Plan */}
                <Card className="flex flex-col divide-y divide-gray-200 rounded-lg border-2 border-primary shadow-lg">
                  <CardHeader className="flex-1 p-6">
                    <div className="mb-4 inline-flex rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
                      Most Popular
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Professional</CardTitle>
                    <CardDescription className="mt-2">For growing companies</CardDescription>
                    <div className="mt-4 flex items-baseline text-gray-900">
                      <span className="text-4xl font-bold tracking-tight">$99</span>
                      <span className="ml-1 text-xl font-semibold">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col justify-between p-6">
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">10 job postings</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">60 days visibility</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">Advanced candidate filtering</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">Featured job listings</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">Priority email support</p>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter className="p-6">
                    <Button className="w-full" size="lg">
                      <Link href="/auth/register">Get Started</Link>
                    </Button>
                  </CardFooter>
                </Card>

                {/* Enterprise Plan */}
                <Card className="flex flex-col divide-y divide-gray-200 rounded-lg shadow-lg">
                  <CardHeader className="flex-1 p-6">
                    <CardTitle className="text-2xl font-bold text-gray-900">Enterprise</CardTitle>
                    <CardDescription className="mt-2">For large organizations</CardDescription>
                    <div className="mt-4 flex items-baseline text-gray-900">
                      <span className="text-4xl font-bold tracking-tight">$249</span>
                      <span className="ml-1 text-xl font-semibold">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col justify-between p-6">
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">Unlimited job postings</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">90 days visibility</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">Premium candidate filtering</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">Featured and highlighted listings</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">Dedicated account manager</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">API access</p>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter className="p-6">
                    <Button className="w-full" size="lg">
                      <Link href="/auth/register">Get Started</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            {/* Annual Plans */}
            <TabsContent value="annual">
              <div className="mt-12 space-y-4 sm:mt-16 sm:grid sm:grid-cols-3 sm:gap-6 sm:space-y-0 lg:mx-auto lg:max-w-5xl">
                {/* Basic Plan */}
                <Card className="flex flex-col divide-y divide-gray-200 rounded-lg shadow-lg">
                  <CardHeader className="flex-1 p-6">
                    <CardTitle className="text-2xl font-bold text-gray-900">Basic</CardTitle>
                    <CardDescription className="mt-2">For small businesses and startups</CardDescription>
                    <div className="mt-4 flex items-baseline text-gray-900">
                      <span className="text-4xl font-bold tracking-tight">$39</span>
                      <span className="ml-1 text-xl font-semibold">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col justify-between p-6">
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">3 job postings</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">30 days visibility</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">Basic candidate filtering</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">Email support</p>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter className="p-6">
                    <Button className="w-full" size="lg">
                      <Link href="/auth/register">Get Started</Link>
                    </Button>
                  </CardFooter>
                </Card>

                {/* Professional Plan */}
                <Card className="flex flex-col divide-y divide-gray-200 rounded-lg border-2 border-primary shadow-lg">
                  <CardHeader className="flex-1 p-6">
                    <div className="mb-4 inline-flex rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
                      Most Popular
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Professional</CardTitle>
                    <CardDescription className="mt-2">For growing companies</CardDescription>
                    <div className="mt-4 flex items-baseline text-gray-900">
                      <span className="text-4xl font-bold tracking-tight">$79</span>
                      <span className="ml-1 text-xl font-semibold">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col justify-between p-6">
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">10 job postings</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">60 days visibility</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">Advanced candidate filtering</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">Featured job listings</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">Priority email support</p>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter className="p-6">
                    <Button className="w-full" size="lg">
                      <Link href="/auth/register">Get Started</Link>
                    </Button>
                  </CardFooter>
                </Card>

                {/* Enterprise Plan */}
                <Card className="flex flex-col divide-y divide-gray-200 rounded-lg shadow-lg">
                  <CardHeader className="flex-1 p-6">
                    <CardTitle className="text-2xl font-bold text-gray-900">Enterprise</CardTitle>
                    <CardDescription className="mt-2">For large organizations</CardDescription>
                    <div className="mt-4 flex items-baseline text-gray-900">
                      <span className="text-4xl font-bold tracking-tight">$199</span>
                      <span className="ml-1 text-xl font-semibold">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col justify-between p-6">
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">Unlimited job postings</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">90 days visibility</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">Premium candidate filtering</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">Featured and highlighted listings</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">Dedicated account manager</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">API access</p>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter className="p-6">
                    <Button className="w-full" size="lg">
                      <Link href="/auth/register">Get Started</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">Frequently Asked Questions</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:max-w-5xl lg:mx-auto">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">What's included in each plan?</h3>
              <p className="mt-2 text-gray-600">
                Each plan includes a specific number of job postings, visibility duration, and access to our candidate
                filtering tools. Higher-tier plans offer additional features like featured listings and dedicated
                support.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Can I upgrade or downgrade my plan?</h3>
              <p className="mt-2 text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated
                difference. When downgrading, the new rate will apply at the start of your next billing cycle.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Do you offer custom plans?</h3>
              <p className="mt-2 text-gray-600">
                Yes, we offer custom plans for organizations with specific needs. Contact our sales team to discuss your
                requirements and get a tailored solution.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">What payment methods do you accept?</h3>
              <p className="mt-2 text-gray-600">
                We accept all major credit cards, PayPal, and bank transfers for annual plans. All payments are
                processed securely through our payment providers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to find the perfect candidates?
            </h2>
            <p className="mt-4 text-xl text-white/80">
              Join thousands of companies that use Sarvha to find and hire top talent.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
