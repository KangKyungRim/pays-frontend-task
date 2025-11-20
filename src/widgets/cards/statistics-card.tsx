import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { StatisticsCardProps } from "@/types/ui";

export function StatisticsCard({ color, icon, title, value, footer }: StatisticsCardProps) {
  return (
    <Card className="border border-blue-gray-100 shadow-sm flex items-center">
      <CardHeader
        variant="gradient"
        color={color as "blue"}
        floated={false}
        shadow={false}
        className="grid h-12 w-12 place-items-center"
      >
        {icon}
      </CardHeader>
      <CardBody className="p-4 text-center inline-block">
        <Typography variant="small" className="font-normal text-blue-gray-600">
          {title}
        </Typography>
        <Typography variant="h4" color="blue-gray">
          {value}
        </Typography>
      </CardBody>
      {footer && (
        <CardFooter className="border-t border-blue-gray-50 p-4">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}

StatisticsCard.defaultProps = {
  footer: null,
};

StatisticsCard.displayName = "/src/widgets/cards/statistics-card.tsx";

export default StatisticsCard;
