import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Bounty } from '@/types/bounty';

interface BountyRangeFilterProps {
  bounties: Bounty[];
}

const BountyRangeFilter: React.FC<BountyRangeFilterProps> = ({ bounties }) => {
  const router = useRouter();
  const [minBounty, setMinBounty] = useState<number>(0);
  const [maxBounty, setMaxBounty] = useState<number>(10000);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);

  // Initialize filter values from URL query params on mount
  useEffect(() => {
    const { min, max } = router.query;
    if (min) setMinBounty(Number(min));
    if (max) setMaxBounty(Number(max));
  }, [router.query]);

  // Update URL when filter values change
  useEffect(() => {
    const newQuery = { ...router.query };
    if (minBounty > 0) {
      newQuery.min = minBounty.toString();
    } else {
      delete newQuery.min;
    }
    if (maxBounty < 10000) {
      newQuery.max = maxBounty.toString();
    } else {
      delete newQuery.max;
    }
    router.push({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true });
  }, [minBounty, maxBounty, router]);

  // Filter bounties based on range
  const filteredBounties = bounties.filter(bounty => {
    const bountyValue = bounty.reward || 0;
    return bountyValue >= minBounty && bountyValue <= maxBounty;
  });

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setMinBounty(value);
    setIsFiltering(true);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setMaxBounty(value);
    setIsFiltering(true);
  };

  const resetFilter = () => {
    setMinBounty(0);
    setMaxBounty(10000);
    setIsFiltering(false);
  };

  return (
    <div className="bounty-range-filter p-4 bg-gray-50 rounded-lg mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Bounty Range</h3>
        {isFiltering && (
          <button 
            onClick={resetFilter}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Reset
          </button>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Minimum: ${minBounty}
          </label>
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={minBounty}
            onChange={handleMinChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
        
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maximum: ${maxBounty}
          </label>
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={maxBounty}
            onChange={handleMaxChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredBounties.length} of {bounties.length} bounties
      </div>
    </div>
  );
};

export default BountyRangeFilter;