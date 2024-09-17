<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConsData extends Model
{
    protected $table = 'consignments_tracking';

    protected $casts = [
        'Coordinates' => 'array', // Cast to array or json
    ];

    protected $fillable = [
        'ConsignmentId',
        'ConsignmentNo',
        'DebtorId',
        'DebtorName',
        'SenderName',
        'SenderState',
        'SenderSuburb',
        'SenderPostcode',
        'SenderAddressName',
        'ReceiverName',
        'ReceiverState',
        'ReceiverSuburb',
        'ReceiverPostcode',
        'ReceiverAddressName',
        'DespatchDate',
        'RDD',
        'Coordinates',
    ];
}
