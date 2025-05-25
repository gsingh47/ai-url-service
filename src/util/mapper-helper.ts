export const getMappedDestinations = (destinations: any[]) => {
  return destinations.map((item: any) => (
    {primary: item.label1, secondary: item.label2, destType: item.dest_type}
  ));
}