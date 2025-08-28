import GenderChart from './GenderChart';
import BirthDeathChart from './BirthDeathChart';
import EmploymentChart from './EmploymentChart';

interface ChartEntry {
  name: string;
  value: number;
  color: string;
}

export function ChartsSection({
  genderData,
  birthDeathData,
  employmentData,
}: {
  genderData: ChartEntry[];
  birthDeathData: ChartEntry[];
  employmentData: ChartEntry[];
}) {
  return (
    <section className="grid gap-6 md:grid-cols-2">
      <GenderChart data={genderData} />
      <BirthDeathChart data={birthDeathData} />
      <EmploymentChart data={employmentData} />
    </section>
  );
}

export default ChartsSection;
