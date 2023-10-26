import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

type TrademarkStatus = {
  label: string;
  color: string;
};

export type TrademarkDetails = {
  imageUrl: string;
  link: string;
  wordmark: string;
  serialNumber: string;
  statuses: Array<TrademarkStatus>;
  goodsAndServices: string;
  classNumber: string;
  owner: string;
};

// TrademarkCard props
type TrademarkCardProps = {
  details: TrademarkDetails;
  className?: string;
};

const TrademarkCard = ({ details, className }: TrademarkCardProps) => {
  const {
    imageUrl,
    wordmark,
    serialNumber,
    statuses,
    goodsAndServices,
    owner,
    classNumber,
  } = details;
  return (
    <Card className={` ${className}`}>
      <CardHeader>
        <Image
          className="m-2 align-middle"
          src={imageUrl}
          alt={wordmark}
          layout="responsive"
          objectFit="contain"
          width={1}
          height={2}
        />
      </CardHeader>
      <CardContent>
        <div className="">
          <div className="mb-4">
            <h2 className="font-bold text-xl">Wordmark</h2>
            <p className="text-gray-600 mt-1">{wordmark}</p>
          </div>
          <div className="mb-4 flex">
            {statuses.map(function (status, index) {
              console.log(status);
              return (
                <span
                  key={index}
                  className={`${status.color} text-white rounded-full px-3 py-1 mr-2 text-xs`}
                >
                  {status.label}
                </span>
              );
            })}
          </div>
          <div className="mb-4">
            <h2 className="font-bold text-xl">Goods & services</h2>
            <p className="text-gray-600 mt-1 flex items-center">
              {goodsAndServices}
              <span className="ml-2">➔</span>
            </p>
          </div>
          <div className="mb-4">
            <h2 className="font-bold text-xl">Class</h2>
            <p className="text-gray-600 mt-1">{classNumber}</p>
          </div>
          <div className="mb-4">
            <h2 className="font-bold text-xl">Serial</h2>
            <p className="text-gray-600 mt-1">{serialNumber}</p>
          </div>
          <div>
            <h2 className="font-bold text-xl">Owners</h2>
            <p className="text-gray-600 mt-1">{owner}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export { TrademarkCard };
