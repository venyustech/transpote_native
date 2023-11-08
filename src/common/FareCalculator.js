export function farehelper(distance, time, rateDetails) {
  return new Promise(async (resolve, reject) => {
    const ratePerKm = rateDetails.rate_per_kilometer;
    const ratePerHour = rateDetails.rate_per_hour;
    const ratePerSecond = ratePerHour / 3600;
    const minFare = rateDetails.min_fare;
    const DistanceInKM = parseFloat(distance / 1000).toFixed(2);
    const estimateRateForKM = parseFloat(DistanceInKM * ratePerKm).toFixed(2) * 1;
    const estimateRateForhour = parseFloat(time * ratePerSecond).toFixed(2);
    const total = (parseFloat(estimateRateForKM) + parseFloat(estimateRateForhour)) > minFare ? (parseFloat(estimateRateForKM) + parseFloat(estimateRateForhour)) : minFare;

    const convenienceFee = (total * rateDetails.convenience_fees / 100);

    const grandtotal = parseFloat(total) + parseFloat(convenienceFee);
    const calculateData = {
      distaceRate: estimateRateForKM,
      timeRate: estimateRateForhour,
      totalCost: total, grandTotal: grandtotal,
      convenience_fees: convenienceFee
    }

    return resolve(calculateData);
  });
}
