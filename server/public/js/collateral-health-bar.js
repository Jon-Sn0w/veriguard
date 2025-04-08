// CollateralBar Component
function CollateralBar({ 
    label,
    symbol,
    currentCR,
    liquidationCR,
    minimumCR,
    safetyCR,
    mintingCR,
    topupCR,
    exitCR
}) {
    // Calculate percentage for positioning the marker
    const calculatePercentage = () => {
        const minValue = liquidationCR || (symbol === 'SGB' ? 1.4 : 1.1);
        const maxValue = Math.max(mintingCR || 0, exitCR || 0) * 1.2;
        const clampedCR = Math.min(Math.max(currentCR || 0, minValue), maxValue);
        return ((clampedCR - minValue) / (maxValue - minValue)) * 100;
    };

    const percentage = calculatePercentage();
    
    // Determine health status color
    const getHealthColor = () => {
        if (!currentCR || currentCR < minimumCR) return 'text-red-500';
        if (currentCR < safetyCR) return 'text-yellow-500';
        return 'text-green-500';
    };

    // Create threshold markers with their corresponding colors and labels
    const thresholds = [
        { value: liquidationCR, label: 'Liquidation', color: 'border-red-500' },
        { value: minimumCR, label: 'Minimum', color: 'border-orange-500' },
        { value: safetyCR, label: 'Safety', color: 'border-yellow-500' },
        topupCR && { value: topupCR, label: 'Top-up', color: 'border-lime-500' },
        { value: mintingCR, label: 'Minting', color: 'border-green-500' },
        exitCR && { value: exitCR, label: 'Exit', color: 'border-emerald-500' }
    ].filter(Boolean);

    // Health bar elements
    const barElements = [
        // Gradient background
        React.createElement('div', { 
            className: 'absolute inset-0 w-full h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500' 
        }),
        
        // Current position marker
        React.createElement('div', {
            className: 'absolute top-0 w-1 h-full bg-white shadow-lg',
            style: { left: `${percentage}%` }
        })
    ];

    // Add right-side indicator for SGB when CR > 2.5
    if (symbol === 'SGB') {
        barElements.push(
            React.createElement('div', {
                className: 'absolute top-0 w-1 h-full bg-white shadow-lg',
                style: { right: currentCR > 2.5 ? '0%' : `${100 - percentage}%` }
            })
        );
    }

    return React.createElement('div', { className: 'space-y-2' },
        // Header with label and current value
        React.createElement('div', { className: 'flex justify-between items-center' },
            React.createElement('div', { className: 'flex items-center gap-2' },
                React.createElement('span', { className: 'text-sm text-gray-400' }, label),
                React.createElement('span', { className: 'text-xs bg-gray-700 px-2 py-0.5 rounded' }, symbol)
            ),
            React.createElement('span', { className: `font-medium ${getHealthColor()}` },
                `${(currentCR || 0).toFixed(2)}x CR`
            )
        ),
        
        // Health bar visualization
        React.createElement('div', { 
            className: 'relative h-3 rounded-full overflow-hidden bg-gray-900' 
        }, barElements),

        // Threshold markers
        React.createElement('div', { className: 'relative h-8 mt-1' },
            thresholds.map((threshold, index) => {
                if (!threshold?.value) return null;
                const markerLeft = ((threshold.value - (liquidationCR || (symbol === 'SGB' ? 1.4 : 1.1))) / 
                    (2.5 - (liquidationCR || (symbol === 'SGB' ? 1.4 : 1.1)))) * 100;
                
                return React.createElement('div', {
                    key: index,
                    className: 'absolute',
                    style: { left: `${Math.min(Math.max(markerLeft, 0), 100)}%` }
                },
                    React.createElement('div', { className: `h-2 border-l ${threshold.color}` }),
                    React.createElement('div', { className: 'text-xs text-gray-400 -ml-4 mt-1' },
                        threshold.value.toFixed(2)
                    )
                );
            })
        )
    );
}