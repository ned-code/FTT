module ExploreHelper
  def relative_date(time)
    diff_in_minutes = (((Time.now - time).abs)/60).round
    text = ""

    case diff_in_minutes
    when 0..59 then text = I18n.t('relative_date.x_hours', :count => 1 )
    when 60..1439 then text = I18n.t('relative_date.x_hours', :count => (diff_in_minutes/60).round )
    when 1440..9800 then text = I18n.t('relative_date.x_days', :count => (diff_in_minutes/60/24).round )
    else
      text = I18n.l(time.to_date)  
    end

    text
  end
end
