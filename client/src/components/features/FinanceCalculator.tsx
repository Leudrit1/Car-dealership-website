import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface FinanceCalculatorProps {
  carPrice?: number;
}

export default function FinanceCalculator({ carPrice = 50000 }: FinanceCalculatorProps) {
  const [price, setPrice] = useState(carPrice);
  const [downPayment, setDownPayment] = useState(carPrice * 0.2); // 20% default down payment
  const [loanTerm, setLoanTerm] = useState(60); // months
  const [interestRate, setInterestRate] = useState(3.5);

  const calculateMonthlyPayment = () => {
    const principal = price - downPayment;
    const monthlyRate = interestRate / 1200;
    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) /
      (Math.pow(1 + monthlyRate, loanTerm) - 1);
    return isNaN(monthlyPayment) ? 0 : monthlyPayment;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-lg p-6 space-y-6"
    >
      <div className="flex items-center space-x-2 mb-4">
        <Calculator className="w-5 h-5" />
        <h3 className="text-xl font-semibold">Finance Calculator</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Car Price (CHF)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">CHF</span>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="pl-12"
              min={0}
            />
          </div>
        </div>

        <div>
          <Label>Down Payment (CHF)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">CHF</span>
            <Input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="pl-12"
              min={0}
              max={price}
            />
          </div>
        </div>

        <div>
          <Label>Loan Term (months)</Label>
          <div className="space-y-2">
            <Slider
              value={[loanTerm]}
              onValueChange={(value) => setLoanTerm(value[0])}
              min={12}
              max={84}
              step={12}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>12 months</span>
              <span>84 months</span>
            </div>
          </div>
        </div>

        <div>
          <Label>Interest Rate (%)</Label>
          <div className="space-y-2">
            <Slider
              value={[interestRate]}
              onValueChange={(value) => setInterestRate(value[0])}
              min={0}
              max={20}
              step={0.1}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0%</span>
              <span>20%</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Estimated Monthly Payment</p>
            <p className="text-3xl font-bold text-primary">
              {new Intl.NumberFormat('de-CH', {
                style: 'currency',
                currency: 'CHF',
              }).format(calculateMonthlyPayment())}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}